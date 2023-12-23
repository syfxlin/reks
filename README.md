# Reks

[Keystatic](https://keystatic.com/) is Git-based CMS, live edit content on GitHub or your local file system, without disrupting your existing code and workflows.

@syfxlin/reks is a library of enhancements to reks to improve the experience of using keystatic.

## Motivation

Keystatic uploads the image to the specified folder when processing the image and also writes the file path to the markdoc/yaml/json file. Normally this is fine, but when used in Next.js, height/width must be provided if image optimization is to be used. To make Next.js get height/width, can write the value to the filename, e.g. `image.x1920x1080.jpg`.

Keystatic provides time fields, which can be set manually and can have default values, but sometimes we want to add an update time field, we need to set it manually every time we edit, which is not actually inconvenient, if you forget to set it, the value will be wrong.

I started this project as a proof-of-concept to fix these problems.

## Maintainer

**@syfxlin/reks** is written and maintained with the help of [Otstar Lin](https://github.com/syfxlin) and the following [contributors](https://github.com/syfxlin/reks/graphs/contributors).

## License

Released under the [MIT](https://opensource.org/licenses/MIT) License.
