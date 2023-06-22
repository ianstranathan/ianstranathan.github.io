from os import listdir
from os.path import isfile

import utils

def get_template_component(component: str, template: list, formatting: bool) -> list:

    # -- change this to actually account for spacing string differences in array elements
    component_start_index = template.index('    <' + component + '>\n') if formatting else template.index('<' + component + '>\n')
    component_end_index   = template.index('    </'+ component + '>\n') if formatting else template.index('</'+ component + '>\n')
    return template[ component_start_index : component_end_index + 1]


def debug_print(component: str, template: list, formatting: bool) -> None:
    component_arr = get_template_component(component, template, formatting)
    for i, line in enumerate(component_arr):
        print(f"{i}:{line}")


def recurse_through_pages(file_path: str, components: dict, folder_data_struct) -> None:

    if isfile(file_path):
        join_page_arr_with_components_arrs( file_path, components )  # -- inject header and footer
        folder_data_struct.append(file_path[3:])         # -- save file path for main page
        return
    
    for folder in listdir( file_path ):
        level_down_file_path = file_path + "/" + folder
        recurse_through_pages( level_down_file_path,  components, folder_data_struct)

            
def join_page_arr_with_components_arrs(generated_index_page_path: str, components: dict) -> None:
    generated_page = open(generated_index_page_path, encoding="utf8")
    generated_page_lines = generated_page.readlines()
    generated_page.close()

    # -- Note. This will break if the org file that's generated has different formatting
    
    page_start_to_body = generated_page_lines[0: generated_page_lines.index('<body>\n') + 1]     # -- Page content up to (including) body tag
    # -- Page data between the body tags
    page_content = generated_page_lines[generated_page_lines.index('<body>\n')+ 1 : generated_page_lines.index('</body>\n')]

    s = "".join( page_start_to_body + components["header"] + page_content + components["footer"] + ["  </body>\n"])
    n = open(generated_index_page_path, "w")
    n.write(s)
    n.close()

    
def make_category(category: str) -> str:
    return f"<p style='text-decoration: underline;'></p><span>{category}</span>\n"


def make_sub_category(category: str) -> str:
    return f"<span style='opacity: 0.75; font-size: 0.8em;'>{category}</span>\n"


def make_link(link: str, title: str) -> str:
    return f"<a href='{link}'>{title}</a>\n"


def make_front_page_links(arr_of_paths: list) -> str:
    category = ""
    sub_category = ""
    html_injection = ""
    ls_separated = list( map( lambda x: x.split("/")[1:], arr_of_paths))
    # -- slots to compare subcategories against
    # -- add category if it's new
    categories = [""] * 10 # -- there's very doubtfully ever going to be 10 subcategories
    for i, link_arr in enumerate(ls_separated):
        for j in range(len(link_arr) - 2):
            # -- 
            if categories[j] != link_arr[j]:
                categories[j] = link_arr[j]
                html_injection += make_category( link_arr[j] ) if j == 0 else make_sub_category( link_arr[j] )

        the_link = "/pages/" + "/".join(link_arr[0:-1]) + "/" # -- to default to the index.html file with modern tastes
        the_title = utils.snake_case_to_standard(link_arr[-2])
        # -- don't want to add the about section
        if the_title != "About":
            html_injection += make_link( the_link, the_title ) 
    return html_injection


def main(path_to_pages: str):

    # -- inject header and footer into each generated page:
    template = open("../templates/main.html") # -- This is the template file that contains the header and footer components
    template_lines = template.readlines()     # -- file as an arr, each element is a new line
    template.close()
    components = {"header": get_template_component("header", template_lines, True),
                  "footer": get_template_component("footer", template_lines, True)}
    folder_data_struct = [] # -- paths of each link
    recurse_through_pages(path_to_pages, components, folder_data_struct)
        
    # -- inject into main page
    front_page = open("../index.html", encoding="utf8")
    front_page_lines = front_page.readlines()
    front_page.close()

    main_tag = '    <main style="display: flex; flex-direction: column">\n'
    front_page_start_to_main = front_page_lines[0: front_page_lines.index(main_tag) + 1]  # -- Page content up to (including) main tag
    front_page_links = make_front_page_links(  folder_data_struct )

    s = "".join( front_page_start_to_main ) + front_page_links  +  '    </main>\n' + "".join(components["footer"])
    n = open("../index.html", "w")
    n.write(s)
    n.close()
    
main( "../pages" )
