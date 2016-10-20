###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

# We need relative links everywhere
set :relative_links, true
activate :relative_assets

# With alternative layout
# page "/path/to/file.html", layout: :otherlayout

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", locals: {
#  which_fake_page: "Rendering a fake page with a local variable" }

# General configuration

###
# Helpers
###

# Methods defined in the helpers block are available in templates
helpers do
  def nav_item text: "", path: "", &block
    base_name = path.gsub(".html", "")
    base_path = current_page.path.gsub(".html", "")
    active_class = base_path =~ /#{base_name}/ ? "active" : ""
    active_class += " dropdown" if block_given?

    if block_given?
      concat(content_tag :li, capture(&block), class: "nav-item #{active_class}")
    else
      content_tag :li, class: "nav-item #{active_class}" do
        link_to text, path, class: "nav-link"
      end
    end
  end
end

# Build-specific configuration
configure :build do
  # Minify CSS on build
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript
end
