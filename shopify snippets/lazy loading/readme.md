To import the script in theme.liquid

``` <script src="{{ 'lazysizes.min.js' | asset_url }}" async="async"></script> ```

To lazy load an image

```{% render 'lazy-images', image: bg, className:bg_image_class %}```
