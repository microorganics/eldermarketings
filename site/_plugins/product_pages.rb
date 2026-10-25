require "json"

# Generates a static, crawlable page for every product defined in
# js/data/products.json at /product/<slug>/ and exposes the parsed product
# data to Liquid templates (listing page + sitemap) via site.data["products"].
#
# This keeps products.json as the single source of truth while giving each
# product a real URL with server-rendered HTML, images and structured data
# so Google can index the products and their images.
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

      # Same-named products (e.g. a capsule and a dry syrup) get the category in
      # their title so no two product pages share a <title>. Every product also
      # gets a descriptive image alt used by the detail page, listing and related cards.
      name_counts = products.each_with_object(Hash.new(0)) { |p, h| h[p["name"]] += 1 }
      products.each do |p|
        p["display_name"] = name_counts[p["name"]] > 1 ? "#{p["name"]} (#{p["category"]})" : p["name"]
        p["alt"] = "#{p["display_name"]} - #{p["description"]}".strip[0, 160]
      end

      products.each do |product|
        slug = product["slug"]
        next if slug.nil? || slug.to_s.strip.empty?

        related = products.select do |p|
          p["category"] == product["category"] && p["slug"] != slug
        end.first(3)

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

      Jekyll.logger.info "Products:", "Generated #{products.length} product pages"
    end
  end
end
