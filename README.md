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

## Getting information from the .jar files
[Source code](getModInfo.py) <br>
Really handy Python script, which helped me with version control, without the need
to commit large .jar files to the repo. It does it by reading the text files, that
were used for indexing in other software. In short, it retrieves the file name,
an URL which can come in two variants depending on the source, and each of them
needs to be retrieved differently. Finally, it exports all the data to the text file,
in an Excel friendly format.

## JavaScript scripts for Minecraft modding
[Source code](CustomRecipes%26BlockEvents.js) <br>
Minecraft is a 3D sandbox game with a huge modding community
that created tens of thousands of modifications for it.
Thanks to the [KubeJS](https://www.curseforge.com/minecraft/mc-mods/kubejs)
modification for Minecraft, I was able to utilize JavaScript to make changes
in various base game mechanics, and even other users modifications. <br>
For example, in the above script, I was able to add custom recipes,
various events, when right-clicking blocks and even schedule method calls.
It greatly sped up the creation process in my personal project,
where I make a custom experience for the other players.
