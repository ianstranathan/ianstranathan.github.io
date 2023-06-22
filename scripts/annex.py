import utils

ls = ["pages/Graphics/halfway_vector/index.html",
      "pages/Graphics/model_view_projection/index.html",
      "pages/Graphics/polynomial_smin/index.html",
      "pages/Graphics/ray_sphere_intersection/index.html",
      "pages/Graphics/reflection_and_refraction_in_a_raytracer/index.html",
      "pages/Math/angle_bisector/index.html",
      "pages/Math/distance_to_plane_and_ray_plane_intersection/index.html",
      "pages/Math/euler_lagrange_equation/index.html",
      "pages/Math/euler_method/index.html",
      "pages/Misc/about/index.html",
      "pages/Misc/personal_websites_are_dumb/index.html",
      "pages/Misc/quotes/index.html",
      "pages/Misc/short_stories/index.html",
      "pages/Physics/impulse_based_collision/index.html",
      "pages/Physics/snells_law/index.html",
      "pages/Projects/JS & WebGL (Old)/collision_resolution/index.html",
      "pages/Projects/JS & WebGL (Old)/learning_to_relax/index.html",
      "pages/Projects/JS & WebGL (Old)/rubiks_cube/index.html",
      "pages/Resources/graphics/index.html",
      "pages/Resources/programming/index.html",]

def make_category(category: str) -> str:
    return f"<p></p><span>{category}</span>\n"

def make_sub_category(category: str) -> str:
    return f"<span>{category}</span>\n"

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

        the_link = "ianstranathan.github.io/" + "/".join(link_arr[0:-1])
        the_title = utils.snake_case_to_standard(link_arr[-2])
        # -- don't want to add the about section
        if the_title != "About":
            html_injection += make_link( the_link, the_title ) 
    return html_injection
    
print(html_injection)
# <p></p><span>Graphics</span><a href="pages/Graphics/halfway_vector">Halfway Vector</a>
# <a href="pages/Graphics/model_view_projection">Model View Projection</a>
# <a href="pages/Graphics/polynomial_smin">Polynomial Smin</a>
# <a href="pages/Graphics/ray_sphere_intersection">Ray Sphere Intersection</a>
# <a href="pages/Graphics/reflection_and_refraction_in_a_raytracer">Reflection And Refraction In A Raytracer</a>
