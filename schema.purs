module Schema where

import CSS.Common (auto)
import Data.DateTime (DateTime(..))

type Data
  = String

type Id
  = String

type Snapshot
  = { snapshotId :: Id
    , timestamp :: DateTime
    , data :: Data
    }

type Work
  = { workId :: Id
    , snapshots :: Array Snapshot
    , contentId :: Id
    }

type User
  = { userId :: Id
    , commits :: Array UsersCommit
    }

type Commit
  = { commitId :: Id
    , committerUserId :: Id
    , workId :: Maybe Id
    , data :: Data
    }

type Content
  = { contentId :: Id
    , data :: Data
    , commits :: Array Commit
    }



サイズの極値でsnapshotを作成する
10
20
30
40
50
51
52
40 52作成
30
20
18
15 
20 15作成
10 20作成
8
2
100 2作成
