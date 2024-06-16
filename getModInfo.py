import os

def get_line_from_text_file(file_path: str, text_to_search: str):
    # Open the file inside the zip
    with open(file_path, 'r') as file:
        # Read the lines and return the specific line
        for line in file:
            if text_to_search in line:
                # If doesn't begin with a searched text skip it
                if text_to_search[0] != line[0]: continue
                return line.strip()
        else:
            print(f"Line {text_to_search} does not exist in the file {file.name}.")
            return None

def trim_line(line: str):
    line = line.split('=')[1].strip()
    line = line[1:-1]
    return line

def remove_bracket_info(line: str):
    symbols = ['(', '[']
    found_symbol = ''
    for symbol in symbols:
        if not symbol in line: continue
        found_symbol = symbol
    return line.split(found_symbol)[0].strip()

###
DIRECTORY = './mods/.index'
TEXT_SEPARATOR = ';'
###

found_text = []
# Go through all of the files in directory
for filename in os.listdir(DIRECTORY):
    if not filename.endswith('.toml'):
        continue
    filepath = os.path.join(DIRECTORY, filename)
    if os.path.isfile(filepath):
        final_text = ''

        # Get the name
        text_line = get_line_from_text_file(filepath, 'name')
        if text_line == None: continue
        text_line = trim_line(text_line)
        if '(' in text_line[1:] or '[' in text_line[1:]:
            text_line = remove_bracket_info(text_line)
        final_text += text_line

        # Get the url
        # Check which download mode is selected
        url_mode = get_line_from_text_file(filepath, 'mode')
        if 'metadata:curseforge' in url_mode:
            text_line = get_line_from_text_file(filepath, 'project-id')
            text_line = text_line.split('=')[1].strip()
            text_line = f'https://www.curseforge.com/projects/{text_line}'
            if text_line == None: continue
            final_text += TEXT_SEPARATOR + text_line

        elif 'url' in url_mode:
            text_line = get_line_from_text_file(filepath, 'url')
            if text_line == None: continue
            text_line = trim_line(text_line)
            final_text += TEXT_SEPARATOR + text_line

        else:
            print(f"Unknown url mode: {url_mode}.")

        found_text.append(final_text.strip())


with open('modList.txt', 'w') as text_output_file:
    for line in found_text:
        text_output_file.write(f'{line}\n')