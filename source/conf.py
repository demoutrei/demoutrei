# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'demoutrei'
copyright = '2026, Demoutrei Kurosuke'
author = 'Demoutrei Kurosuke'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [ "shibuya", "sphinx_design" ]

templates_path = ['_templates']
exclude_patterns = []



# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'shibuya'
html_title = "demoutrei"
html_theme_options = {
  "accent_color": "green",
  "color_mode": "dark",
  "globaltoc_expand_depth": 1,
  "toctree_collapse": True,
  "toctree_maxdepth": 5,
  "show_ai_links": False,
  "nav_links": [
    {
      "title": "GuideBooks",
      "url": "https://guides.demoutrei.dev"
    }
  ]
}
html_static_path = ['_static']
html_css_files = ["custom.css"]
