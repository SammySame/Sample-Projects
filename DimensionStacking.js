// priority: 0

const TeleportTypes = Object.freeze({
  /** Height set in config */
  EXACT: 'exact',
  /** Height set in config and destroys nearby blocks */
  EXACT_HOLLOW: 'exact_hollow',
  /** On the surface of the dimension */
  GROUND_SURFACE: 'ground_surface',
  /** In the air with space around */
  AIR_SAFE: 'air_safe'
})

const scriptDelayTicks = 10
const teleportCooldownTicks = 10 * 20
const yMotionTicks = 3 * 20
const maxSetPassangerTries = 5

const jsonConfigFilePath = 'config\\dimensionrules.json'
/** @type {TeleportRules[]} */
let teleportRules = []

// Parse the config file
ServerEvents.loaded(event => {
  try {
    let jsonContent = JsonIO.read(jsonConfigFilePath)
    if (jsonContent == null) throw new Error
      (`Config file located at "${jsonConfigFilePath}" could not be loaded`)

    jsonContent.rules.forEach(rules => {
      const from_dim = rules.from_dim
      const to_dim = rules.to_dim
      const from_y_min = rules.from_y_min
      const from_y_max = rules.from_y_max

      if (from_y_min > from_y_max) throw new Error
        (`rules ${from_dim} => ${to_dim} has "from_y_min" value larger than "from_y_max"`)

      teleportRules.push(rules)
    })
  } catch (error) {
    console.error(error)
  }

  let dimmension_list = "\n=== Dimensions List ==="
  for (const dimension of event.server.levelKeys()) {
    dimmension_list += `\n${dimension.location()}`
  }
  console.log(dimmension_list)
})

// Debug function
// BlockEvents.rightClicked('stone', event => {
//   let {server, player} = event
//   let pos = event.block.pos
//   let chunk = event.level.getChunk(pos.x, pos.z)
//   server.runCommandSilent(`execute in minecraft:the_nether run forceload add ${chunk.pos.x} ${chunk.pos.z}`)

//   server.scheduleInTicks(1, ctx => {
//     hollowInRadius('minecraft:the_nether', pos, 0)
//     player.teleportTo('minecraft:the_nether', pos.x + 1, pos.y, pos.z + 1, player.yaw, player.pitch)
//   })
// })


let passedTicks = 0
LevelEvents.tick(event => {
  passedTicks += 1
  if (passedTicks >= scriptDelayTicks) {
    passedTicks = 0
  } else return

  /* Check every players dimension and y value
  to determine if they should be teleported */
  event.server.players.forEach(player => {
    let passedTicks = player.level.getTime() - player.persistentData.dimensionSwitchTime
    if (passedTicks < teleportCooldownTicks) return

    for (let rules of teleportRules) {
      if (player.level.dimension.compareTo(rules.from_dim) != 0) continue
      if (!(player.position().y() > rules.from_y_min &&
        player.position().y() < rules.from_y_max)) continue

      forceLoadChunk(player, rules)
      event.server.scheduleInTicks(1, ctx => {
        if (player.vehicle) {
          teleportEntitiesWithVehicle(rules, player)
        } else {
          teleportPlayer(rules, player)
        }
      })
      break
    }
  })
})


/**
 * @param {Internal.Entity} entity
 * @param {TeleportRules} rules
 */
function teleport(entity, rules) {
  let level = Utils.server.getLevel(rules.to_dim)
  let blockPosition = new BlockPos(entity.x, rules.to_y, entity.z)

  switch (rules.teleport_type) {
    case(TeleportTypes.EXACT):
      entity.teleportTo(rules.to_dim, entity.x, rules.to_y, entity.z, entity.yaw, entity.pitch)
      break
    case(TeleportTypes.EXACT_HOLLOW):
      hollowInRadius(level, blockPosition, 2)
      break
  }
}


const blocksToIgnore = BlockStatePredicate
  .of('minecraft:bedrock')
/**
 * @param {ResourceLocation} dimension
 * @param {BlockPos} position
 * @param {number} radius
 */
function hollowInRadius(dimension, position, radius) {
  let aabb = AABB.ofBlock(position).inflate(radius)
  let {maxX, maxY, maxZ} = aabb
  let level = Utils.server.getLevel(dimension)
  console.log(`
    minX:${aabb.minX}, maxX:${maxX}
    minY:${aabb.minY}, maxY:${maxY}
    minZ:${aabb.minZ}, maxZ:${maxZ}`)

  for (let x = aabb.minX; x <= maxX; x++) {
    for (let y = aabb.minY; y <= maxY; y++) {
      for (let z = aabb.minZ; z <= maxZ; z++) {
        let blockPos = new BlockPos(x, y, z)
        if (blocksToIgnore.test(level.getBlockState(blockPos))) continue
        level.destroyBlock(blockPos, false)
      }
    }
  }
}


/**
 * @param {BlockPos} pos
 * @param {TeleportRules} rules
 */
function forceLoadChunk(pos, rules) {
  if (rules.teleport_type !== TeleportTypes.EXACT) return
  let chunk = Utils.server.getLevel(rules.to_dim).getChunk(entity.x, entity.z)
  Utils.server.runCommandSilent(`execute in ${rules.to_dim} run forceload add ${pos.x} ${pos.z}`)
}


/**
 * @param {Internal.Entity} player
 * @param {TeleportRules} rules
 */
function teleportPlayer(player, rules) {
  player.persistentData.dimensionSwitchTime = player.level.getTime()
  player.teleportTo(rules.to_dim, player.x, rules.to_y, player.z, player.yaw, player.pitch)
  applyEffects(player, rules.effects)
}


/**
 * @param {Internal.Entity} player
 * @param {TeleportRules} rules
 */
function teleportEntitiesWithVehicle(player, rules) {
  let vehicle = player.getVehicle()
  let driver = vehicle.controllingPassenger
  let playerPassengers = vehicle.passengers.filter((entity) => entity.isPlayer())
  let teleportId = getRandomInt(1000)

  playerPassengers.forEach(entity =>
    entity.persistentData.dimensionSwitchTime = entity.level.getTime())
  vehicle.persistentData.putInt('TeleportId', teleportId)

  vehicle.passengers.forEach(e => {
    e.teleportTo(rules.to_dim, e.x, rules.to_y, e.z, e.yaw, e.pitch)
  })
  vehicle.teleportTo(
    rules.to_dim, vehicle.x, rules.to_y, vehicle.z, vehicle.yaw, vehicle.pitch
  )

  /** @type {Internal.EntityArrayList} */
  let playerList = playerPassengers.clone()
  /** @type {Internal.Entity} */
  let newVehicle = null
  
  let setPassangerTries = 0

  // Delay before attempting to set the passengers
  Utils.server.scheduleRepeatingInTicks(2, ctx => {
    if (newVehicle == null) {
      if (setPassangerTries > maxSetPassangerTries) { ctx.clear; return }

      let near = getNearbyEntities(player.block.pos, Utils.server.getLevel(rules.to_dim))
      newVehicle = near.toArray().find((entity) => {
        return entity.persistentData.getInt('TeleportId') == teleportId
      })
      if (newVehicle == null) {
        console.log("Couldn't locate the vehicle, trying again...")
        setPassangerTries++
        return
      }
    }

    for (let i = playerList.size() - 1; i >= 0; index--) {
      p = playerList.get(i)
      if (p.isPassenger()) playerList.remove(i)
    }
    if (playerList.size() > 0) {
      console.log("Couldn't locate all of the players, trying again...")
      console.log(`List of the missing players:\n${playerList}`)
      setPassangerTries++
      return
    }

    // playerPassangers.forEach(entity => {
    //   entity.level.addParticle("minecraft:portal", entity.x, entity.y + 1.0, entity.z)
    // })

    if (newVehicle.isLiving()) {
      applyCommandEffects(newVehicle, rules.effects)
    } else {
      // Exponential up momentum, based on the -y motion
      let ticks = 0
      Utils.server.scheduleRepeatingInTicks(1, ctx2 => {
        ticks++
        if (ticks > yMotionTicks) ctx2.clear()

        let yMotion = newVehicle.getMotionY()
        if (yMotion > 0) return
        yMotion = -yMotion
        newVehicle.addMotion(0.0, (Math.pow(yMotion, 2) + yMotion) / 10, 0.0)
      })
    }
    ctx.clear()
  })
}


/**
 * @param {BlockPos} pos
 * @param {Internal.Level} level
 * @returns {Internal.EntityArrayList}
 */
function getNearbyEntities(pos, level) {
  let aabb = AABB.ofBlock(pos).inflate(4)
  let nearEntities = level.getEntitiesWithin(aabb)
  return nearEntities
}


/**
 * @param {Internal.LivingEntity} entity
 * @param {PotionEffect[]} effects
*/
function applyEffects(entity, effects) {
  effects.forEach(effect => {
    entity.potionEffects.add(effect.id, effect.duration, effect.amplifier, false, false)
  })
}


/**
 * Running command for the non-player entities
 * instead of potionEffects.add() is necessary
 * @param {PotionEffect[]} effects
 * @param {Internal.Entity} entity
 */
function applyCommandEffects(entity, effects) {
  effects.forEach(effect => server.runCommandSilent(
    `effect give ${entity.etf$getUuid()} ${effect.id} ${effect.duration} ${effect.amplifier} false`
  ))
}


/**
 * @param {number} max
 * @returns {number} 
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


/**
  * @typedef {Object} PotionEffect
  * @property {Internal.MobEffect} id
  * @property {number} duration
  * @property {number} amplifier
 */
/**
* @typedef {Object} TeleportRules
* @property {keyof TeleportTypes} teleport_type
* @property {ResourceLocation} from_dim
* @property {ResourceLocation} to_dim
* @property {number} from_y_min
* @property {number} from_y_max
* @property {number} to_y
* @property {PotionEffect[]} effects
*/
