To import the script in theme.liquid

``` <script src="{{ 'lazysizes.min.js' | asset_url }}" async="async"></script> ```

To lazy load an image

```{% render 'lazy-images', image: bg, className:bg_image_class %}```

To lazy load  a background image

- Add class of lazyload 
- Add the actual image in the data-bg
- add the set in the data-bgset

``` 
<div id="hero-section" class="hero-section lazyload" 
     data-bg="{{section.settings.background_image | img_url : 'master'}}"
     data-bgset="{{section.settings.background_image | img_url : '220x'}} 220w,
                 {{section.settings.background_image | img_url : '300x'}} 300w,
                 {{section.settings.background_image | img_url : '600x'}} 600w,
                 {{section.settings.background_image | img_url : '900x'}} 900w,
                 {{section.settings.background_image | img_url : '1080x'}} 1080w,
                 {{section.settings.background_image | img_url : '1296x'}} 1296w,
                 {{section.settings.background_image | img_url : '1512x'}} 1512w,
                 {{section.settings.background_image | img_url : '1728x'}} 1728w,
                 {{section.settings.background_image | img_url : '1944x'}} 1944w,
                 {{section.settings.background_image | img_url : '2048x'}} 2048w">
```
