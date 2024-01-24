# コーディング規約
クリーンアーキテクチャもどきを採用、各ファイルに紐付けて記述の分類を説明していく


## env
ここにはsheetやcalenderの読み込みなどを記述する。gasはrootは全てglobal変数なので、これをrepoて使い回す
### env.js
ここに書いてく


## usecase
ビジネスロジックを記述。service層でビジネスロジックを切り分けた関数を登録しておき、それをusecaseでは呼び出すという流れ。
### usecase.js
ここに書いていく


## service
システムロジックを記述。repo層で細かい処理をwrapした関数を登録しておき、それを serviceでは呼び出すという流れ。
### service.js
ここに書いていく

## repository
serviceで使われる、細かい処理をここに書いていく。hashやobjの取り扱い、時間系などはutilへ。repoでrepo内の別の関数を呼び出すのはok
### readRepository.js
### writeRepository.js
これらに書いていく


### utils.js


# 開発フロー
基本的にgas上でgas assistant(chrome extension)を用いて開発する
1. mainからpull
2. create new branch
3. ..dev..
4. push
5. merge
