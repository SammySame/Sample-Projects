# Sample-Projects
Some examples of my personal coding projects.

## A* Galaxy Generator
[Separate repo link](https://github.com/Pick65/AStar-Galaxy-Generator) <br>
Above repo already has an extensive write-up about the inner workings of the project.
It even has a web version that can be played right in the browser.

## Blender batch render
[Source code](blenderBatchRender.py) <br>
Blender is a 3D modelling and rendering software.
It has a Python API that can be used to create custom plugins. <br>
In this case, I used it to automate rendering out a scene with different
textures for the object, several resolutions, and different camera angles.
It can easily be used for different projects if so desired.

## Retrieving data for Version Control and Excel
[Source code](getModInfo.py) <br>
Really handy Python script, which helped me with version control, without the need
to commit large .jar files to the repo. It does it by reading the text files, that
were used for indexing in other software. In short, it retrieves the file name,
file version number, and an URL which can come in two variants depending on the download source.
Finally, it exports all the data to the text file, in an Excel friendly format.

## JavaScript scripts for Minecraft modding
[Source code](DimensionStacking.js) <br>
[Example config](DimensionStackingConfig.json) <br>
Minecraft is a 3D sandbox game with a huge modding community
that created tens of thousands of modifications for it.
Thanks to the [KubeJS](https://www.curseforge.com/minecraft/mc-mods/kubejs)
modification for Minecraft, I was able to utilize JavaScript to make changes
to various base game mechanics, and even other player creations. <br>
In the above script, I was able to add a system for moving between in-game
dimensions. Because the ability to teleport a player, that is riding an entity is non-existent
in the base game, I have created a completely custom solution.
The custom config file is used to define the dimension teleporting rules.
It supports applying effects to the player, height to teleport from and into.
