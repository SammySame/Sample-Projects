import bpy
import os
import time
import random
from typing import NamedTuple

class RenderInfo(NamedTuple):
    file_name: str
    width: int
    height: int
    color_transition: bool

render_index = 0

### Render Settings ###
render_path = 'S:\\Hobby\\Client\\DawidKaseta\\'
RESOLUTION_PERCENTAGE = 100
FRAME_END = 300
UNIQUE_AMOUNT = 5
RENDER_INFO = [
    RenderInfo("Transition1_FullHD", 1920, 1080, True),
    RenderInfo("Transition2_FullHD", 1920, 1080, True),
    RenderInfo("Transition3_FullHD", 1920, 1080, True),
    RenderInfo("Transition4_FullHD", 1920, 1080, True),
    RenderInfo("Transition5_FullHD", 1920, 1080, True),
    RenderInfo("Color1_FullHD", 1920, 1080, False),
    RenderInfo("Color2_FullHD", 1920, 1080, False),
    RenderInfo("Color3_FullHD", 1920, 1080, False),
    RenderInfo("Color4_FullHD", 1920, 1080, False),
    RenderInfo("Color5_FullHD", 1920, 1080, False),
    RenderInfo("Transition1_4k", 4096, 2160, True),
    RenderInfo("Transition2_4k", 4096, 2160, True),
    RenderInfo("Transition3_4k", 4096, 2160, True),
    RenderInfo("Transition4_4k", 4096, 2160, True),
    RenderInfo("Transition5_4k", 4096, 2160, True),
    RenderInfo("Color1_4k", 4096, 2160, False),
    RenderInfo("Color2_4k", 4096, 2160, False),
    RenderInfo("Color3_4k", 4096, 2160, False),
    RenderInfo("Color4_4k", 4096, 2160, False),
    RenderInfo("Color5_4k", 4096, 2160, False)
    ]

def prepare_render():
    setup_scene()
    setup_object()
    bpy.ops.render.render(animation = True)

def setup_scene():
    bpy.data.scenes["Scene"].render.resolution_x = RENDER_INFO[render_index].width
    bpy.data.scenes["Scene"].render.resolution_y = RENDER_INFO[render_index].height
    bpy.data.scenes["Scene"].frame_end = FRAME_END
    bpy.data.scenes["Scene"].render.resolution_percentage = RESOLUTION_PERCENTAGE

def setup_object():
    material = bpy.data.materials["Toon_Transition"]
    pre_index = render_index % UNIQUE_AMOUNT
    post_index = 0 if pre_index == 4 else pre_index + 1
    
    # Get the values of colors from the before prepared shader mix nodes
    base_color_pre = material.node_tree.nodes["Color" + str(pre_index)].inputs[6].default_value
    middle_color_pre = material.node_tree.nodes["Color" + str(pre_index)].inputs[7].default_value
    base_color_post = material.node_tree.nodes["Color" + str(post_index)].inputs[6].default_value
    middle_color_post = material.node_tree.nodes["Color" + str(post_index)].inputs[7].default_value

    # Switch the textures
    material.node_tree.nodes["Stylized Shader"].inputs[2].default_value = base_color_pre
    material.node_tree.nodes["Stylized Shader"].inputs[3].default_value = base_color_post
    material.node_tree.nodes["Stylized Shader"].inputs[4].default_value = middle_color_pre
    material.node_tree.nodes["Stylized Shader"].inputs[5].default_value = middle_color_post

    # Toggle the NLA strip shader animation
    material.node_tree.animation_data.nla_tracks["ShaderTransitions"].strips["ColorTransition"].mute = not RENDER_INFO[render_index].color_transition

def post_render(_scene):
    global render_index
    
    time.sleep(0.5)

    source_path = render_path + '0000-' + '{:04d}'.format(FRAME_END) + '.mp4'
    destination_path = render_path + RENDER_INFO[render_index].file_name + '.mp4'
    os.rename(source_path, destination_path)
    print(f"\"{source_path}\" was renamed to \"{destination_path}\"")
    
    time.sleep(0.5)
    
    render_index += 1
    if render_index < len(RENDER_INFO):
        prepare_render()
    else:
        print("All rendering tasks have ended successfully")

def create_output_dir() -> bool:
    global render_path
    render_path += str(random.randint(0, 99999)) + '\\'
    print("Creating folder to store render files...")
    try:
        os.mkdir(render_path)
    except:
        return False
    else:
        bpy.data.scenes["Scene"].render.filepath = render_path
        print(f"All the files will be stored in \"{render_path}\"")
        return True


if (create_output_dir()):
    print("Starting the rendering tasks")
    bpy.app.handlers.render_complete.append(post_render)
    prepare_render()
else:
    print("Unable to make a directory")