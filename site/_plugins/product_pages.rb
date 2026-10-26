require "json"

# Generates static, crawlable pages from js/data/products.json (the single source of truth):
#   - /product/<slug>/                 one page per product
#   - /products/category/<slug>/       one hub page per category, linking every product in it
# and exposes the parsed data to Liquid (listing page + sitemap) via site.data["products"].
#
# Everything is server-rendered HTML with images and structured data so Google can index
# the products and their images. Hubs and the larger "related" block give every product
# page several strong internal links instead of relying on the single listing page.
module Jekyll
  class ProductPageGenerator < Generator
    safe true
    priority :normal

    def generate(site)
      data_path = File.join(site.source, "js", "data", "products.json")
      return unless File.exist?(data_path)

      data = JSON.parse(File.read(data_path))

      # Expose to Liquid so products.html and sitemap.xml can iterate it.
      site.data["products"] = data

      products = data["products"] || []

      slugify = ->(s) { s.to_s.downcase.gsub(/[^a-z0-9]+/, "-").gsub(/\A-|-\z/, "") }

      # Same-named products (e.g. a capsule and a dry syrup) get the category in
      # their title so no two product pages share a <title>. Every product also
      # gets a descriptive image alt used by the detail page, listing and related cards.
      name_counts = products.each_with_object(Hash.new(0)) { |p, h| h[p["name"]] += 1 }
      products.each do |p|
        p["display_name"] = name_counts[p["name"]] > 1 ? "#{p["name"]} (#{p["category"]})" : p["name"]
        p["alt"] = "#{p["display_name"]} - #{p["description"]}".strip[0, 160]
        p["category_url"] = "/products/category/#{slugify.call(p["category"])}/"
      end

      products.each do |product|
        slug = product["slug"]
        next if slug.nil? || slug.to_s.strip.empty?

        # Same brand family first (Azeeder 200/250/500), then the rest of the category.
        family = product["name"].to_s.split(/[\s\-\/]/).first.to_s.downcase
        same_category = products.select { |p| p["category"] == product["category"] && p["slug"] != slug }
        related = same_category.partition { |p| p["name"].to_s.downcase.start_with?(family) }.flatten.first(6)

        page = PageWithoutAFile.new(site, site.source, File.join("product", slug), "index.html")
        page.content = ""
        page.data["layout"] = "product"
        page.data["title"] = product["display_name"]
        page.data["product"] = product
        page.data["related_products"] = related
        page.data["seo"] = {
          "page_description" => product["description"],
          "featured_image"   => product["image"],
          "noindex"          => false
        }

        site.pages << page
      end

      by_category = products.group_by { |p| p["category"] }
      category_links = by_category.sort_by { |name, items| [-items.size, name] }.map do |name, items|
        { "name" => name, "url" => "/products/category/#{slugify.call(name)}/", "count" => items.size }
      end

      by_category.each do |name, items|
        slug = slugify.call(name)
        page = PageWithoutAFile.new(site, site.source, File.join("products", "category", slug), "index.html")
        page.content = ""
        page.data["layout"] = "product-category"
        page.data["title"] = "#{name} Products"
        page.data["category"] = name
        page.data["category_products"] = items
        page.data["category_links"] = category_links
        page.data["content_blocks"] = [
          {
            "_bookshop_name" => "feature/hero",
            "title" => "#{name} Products",
            "description" => "Elder's #{name.downcase} range: #{items.size} pharmaceutical #{items.size == 1 ? "product" : "products"}.",
            "button" => { "link" => "/products/", "text" => "All Products" }
          }
        ]
        names = items.first(5).map { |p| p["name"] }.join(", ")
        page.data["seo"] = {
          "page_description" => "Elder #{name.downcase} range - #{items.size} formulations including #{names}. See composition, MRP and images for each product.",
          "featured_image"   => items.first["image"],
          "noindex"          => false
        }
        site.pages << page
      end

      Jekyll.logger.info "Products:", "Generated #{products.length} product pages and #{by_category.size} category pages"
    end
  end
end
