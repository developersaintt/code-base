1- Add the section file `sections/eg-wishlist-drawer.liquid`

2- Open file `layout/theme.liquid`
Find (near the bottom of the file): `{% section 'footer' %}`
Add after: `{% section 'eg-wishlist-drawer' %}`

3- Open file: `sections/main-product.liquid`
Find (near the top of the file): `<section class="page-width section-{{ section.id }}-padding">`
Replace it with: `<section class="page-width section-{{ section.id }}-padding" data-product-handle="{{ product.handle }}">`

4- Open file: snippets/card-product.liquid
Find (near the top of the file): `<div class="card-wrapper underline-links-hover">`
Replace it with: `<div class="card-wrapper underline-links-hover" data-product-handle="{{ card_product.handle }}">`



#### Please watch the [Video](https://www.youtube.com/watch?v=3-Gb6NzqFVU) DO NOT skip through the video and watch it in it's entirety otherwise you WILL have bugs
