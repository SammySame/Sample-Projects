# Sample Projects
Some examples of my personal coding projects.

## A* Galaxy Generator (GDScript)
[Separate repo link](https://github.com/Pick65/AStar-Galaxy-Generator) <br>
It includes a fully playable web version of the A* and custom-made node connection algorithm. <br>
For an extensive write-up, please check the repo in the link above.

## My Blender Utils (Python)
[Separate repo link](https://github.com/SammySame/MyBlenderUtils) <br>
It is an add-on with a few automation scripts that can be run with a click of a UI button. <br>
For an extensive write-up, please check the repo in the link above.

## Blender Batch Render (Python)
[Source code](blenderBatchRender.py) <br>
Blender is 3D modeling and rendering software.
It has a Python API that can be used to create custom plugins.
In this case, I used it to automate rendering out a scene with different
textures, several resolutions, and different camera angles.
It really helped me speed up with reiteration on the clients' work.

## Retrieving Data for Version Control and Excel (Python)
[Source code](getModInfo.py) <br>
Really handy Python script, which helped me with version control without the need
to commit large JAR files to the repo. It does it by reading the text files, that
were used for indexing in other software. It retrieves the file name,
file version number, and a URL, which can come in two variants depending on the download source.
Finally, it exports all the data to the text file in an Excel-friendly format.

## JavaScript Scripts for Minecraft Modding (JavaScript)
[Source code](DimensionStacking.js) <br>
[Example config](DimensionStackingConfig.json) <br>
Minecraft is a 3D sandbox game with a huge modding community.
Thanks to the [KubeJS](https://www.curseforge.com/minecraft/mc-mods/kubejs)
modification for Minecraft, I utilized JavaScript to make changes
to various base game mechanics and even other player creations. <br>
In the above script, I added a system for moving between in-game
dimensions. Because the ability to teleport a player, that is riding an entity,
is non-existent in the base game, I have created a completely custom solution.
A custom config file is used to define multiple dimension teleporting rules.
