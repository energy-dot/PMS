#!/bin/bash
# このスクリプトはpackage.jsonを読み込んで、ビルドコマンドを抽出するためのものです
cat package.json | grep -A 5 '"build":'
