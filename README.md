- [日本語版](./README_JA.md)

# oh-my-plateau

# Description

Flip the latitude and longitude of CityGML published by Ministry of Land, Infrastructure, Transport and Tourism of Japan (PLATEAU) to correct them to the valid coordinates.
https://www.geospatial.jp/ckan/organization/toshi

# Usage

    npx oh-my-plateau [options] <filePattern>

**Options:**

- -o, --overwrite overrite existing file
- -m, --minimize minimize file size by removing spaces
- -h, --help display help for command

**e.g.**

    npx oh-my-plateau ./**/*.gml
