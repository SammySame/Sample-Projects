// priority: 0

//Adding in custom recipes using items from a modification
ServerEvents.recipes(e => {
    e.custom({
        type: 'farmersdelight:cutting',
        ingredients: [{item: 'minecraft:dirt'}],
        result: [
            {item: 'minecraft:wheat_seeds', count: 1, chance: 0.15}, 
            {item: 'farmersdelight:tomato_seeds', count: 1, chance: 0.05},
            {item: 'farmersdelight:cabbage_seeds', count:1, chance: 0.05}],
        tool: {tag: 'forge:tools/shovels'}
    })
    e.custom({
        type: 'farmersdelight:cutting',
        ingredients: [{item: 'minecraft:dragon_head'}],
        result: [{item: 'minecraft:netherite_ingot', count: 5}],
        tool: {item: 'minecraft:nether_star'}
    })
})

//Right click events and spawning in custom NBT entities
BlockEvents.rightClicked('grass', e => {
    if (e.hasGameStage('one')) return
    
    let zombie = e.getBlock().createEntity('minecraft:zombie')
    zombie.customName = Component.of(Text.of('Zombie Knight').red().bold())
    zombie.setNbt({ArmorItems: [
        {Count:1, id:'minecraft:diamond_boots'},
        {Count:1, id:'minecraft:diamond_leggings'},
        {Count:1, id:'minecraft:diamond_chestplate'},
        {Count:1, id:'minecraft:golden_helmet'}
    ]})
    zombie.potionEffects.add('minecraft:strength', 1000000, 2, false, true)
    const blockPos = e.getBlock().getPos()
    zombie.setPosition(blockPos)
    zombie.spawn()
    e.getBlock().set('minecraft:air')
    
    e.addGameStage('one')
    const player = e.player
    player.tell('Now I feel much better!')
    player.potionEffects.add('farmersdelight:comfort', 1200, 1, false, false)
    player.potionEffects.add('minecraft:regeneration', 200, 1, false, true)
})

BlockEvents.rightClicked('spruce_log', e => {
    if (!e.hasGameStage('one')) return
    
    e.removeGameStage("one")
    const player = e.player
    player.tell('I\'m feeling unwell...')
    player.potionEffects.add('minecraft:instant_damage', 1, 1, false, false)
    
})

//Advancment checks and scheduling tasks
PlayerEvents.advancement('farmersdelight:main/get_rich_soil', e => {
    if (!e.entity.isPlayer()) return

    e.addGameStage('one')
    const player = e.getPlayer()
    e.getPlayer().potionEffects.add('farmersdelight:nourishment', 200, 2)

    const lightning_strike = () => {
        const lightning = e.getLevel().createEntity('minecraft:lightning_bolt')
        lightning.setPosition(player.x, player.y, player.z)
        lightning.spawn()
    } 
    e.server.scheduleInTicks(30, () => lightning_strike())
    e.server.scheduleInTicks(60, () => lightning_strike())
})

// Some functions that might come in handy later on...
const getAllItemsByTag = tag => Ingredient.of(tag).getItemIds()
const getRandomFromArray = arr => Math.floor(Math.random() * arr.length)