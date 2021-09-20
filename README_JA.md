- [In English](./README.md)

# oh-my-plateau

# 説明

国土交通省都市局 (PLATEAU) から公開されている CityGML の緯度と経度を反転し、正しい座標にします。
https://www.geospatial.jp/ckan/organization/toshi

# 使い方

    npx oh-my-plateau [options] <filePattern>

Options:
-o, --overwrite overrite existing file
-m, --minimize minimize file size by removing spaces
-h, --help display help for command

例)

    npx oh-my-plateau ./**/*.gml
