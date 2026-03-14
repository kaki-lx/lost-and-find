# 校园失物招领平台设计与实现

## 安装依赖

```
npm install
```

### 启动Vue项目

```
npm run serve
```

### 启动Node服务

```
cd service
node app.js
```

### MySQL table

用户信息表
t_users:
id（int）,  // (自增长)
identity（int）,  // 身份 0-平台管理员 1-保管员 2-普通用户
createDate（datetime）,  // 注册时间
username（varchar）,  // 账号
password（varchar）,  // 密码
phone（varchar）,  // 电话
nickname（varchar）,  // 昵称
age（int）,  // 年龄
gender（varchar）,   // 性别
user_pic（varchar）,  // 头像
wechat（varchar）,  // 微信
qq（varchar）,  // QQ
claimLOA（varchar）,  // 认领权限 '0'-关闭 '1'-开启 (默认'1')
revertLOA（varchar）,  // 归还权限 '0'-关闭 '1'-开启 (默认'1')
publishLOA（varchar）,  // 发布权限 '0'-关闭 '1'-开启 (默认'1')
loginLOA（varchar）,  // 登陆权限 '0'-关闭 '1'-开启 (默认'1')
commentsLOA（varchar）,  // 评论/回复权限 '0'-关闭 '1'-开启 (默认'1')
adminLOA（varchar）,  // 后台登陆权限 '0'-关闭 '1'-开启 (默认'0')
adminUserLOA（varchar）,  // 用户管理权限 '0'-关闭 '1'-开启 (默认'0')
adminDataLOA（varchar）,  // 数据管理权限 '0'-关闭 '1'-开启 (默认'0')
adminVerifyLOA（varchar）， // 审核权限， '0'-关闭 '1'-开启 (默认'0')
adminCommentLOA（varchar）， // 评论管理权限， '0'-关闭 '1'-开启 (默认'0')

失物招领信息表
t_claim:
id（int）,  // (自增长)
createDate（datetime）, // 发布时间
claimDate（datetime）, // 申请认领时间
verifyDate（datetime）, // 审核通过时间
finishDate（datetime）, // 完成时间
handlerId（int）, // 认领人ID
handlerNickname（varchar）, // 认领人昵称
handlerPhone（varchar）, // 认领人电话
handlerWechat（varchar）, // 认领人微信
handlerQQ（varchar）, // 认领人QQ
handlerDescribe（varchar）, // 认领人描述
initiatorId（int）, // 发布人ID
initiatorNickname（varchar）, // 发布人昵称
initiatorPhone（varchar）, // 发布人电话
initiatorWechat（varchar）, // 发布人微信
initiatorQQ（varchar）, // 发布人QQ
resume（varchar）, // 物品简述
describe（varchar）, // 物品详情
type（varchar）, // 物品类型
location（varchar）, // 物品拾取地点
date（date）, // 物品拾取日期
article_pic（varchar）, // 物品照片
isFound（int）, // 状态 0-已认领 1-待认领 2-处理中 3-申请中
adminId（int）, // 审核人ID
adminNickname（varchar）, // 审核人昵称

寻物启事信息表
t_revert:
id（int）,  // (自增长)
createDate（datetime）, // 发布时间
revertDate（datetime）, // 申请归还时间
verifyDate（datetime）, // 审核通过时间
finishDate（datetime）, // 完成时间
handlerId（int）, // 归还人ID
handlerNickname（varchar）, // 归还人昵称
handlerPhone（varchar）, // 归还人电话
handlerWechat（varchar）, // 归还人微信
handlerQQ（varchar）, // 归还人QQ
handlerDescribe（varchar）, // 归还人描述
initiatorId（int）, // 发布人ID
initiatorNickname（varchar）, // 发布人昵称
initiatorPhone（varchar）, // 发布人电话
initiatorWechat（varchar）, // 发布人微信
initiatorQQ（varchar）, // 发布人QQ
resume（varchar）, // 物品简述
describe（varchar）, // 物品详情
type（varchar）, // 物品类型
location（varchar）, // 物品丢失地点
date（date）, // 物品拾取日期
article_pic（varchar）, // 物品照片
isFound（int）, // 状态 0-已认领 1-待认领 2-处理中 3-申请中
adminId（int）, // 审核人ID
adminNickname（varchar）, // 审核人昵称

留言信息表
t_comments:
id（int）, // (自增长)
date（datetime）, // 发布日期
authorId（varchar）, // 作者
author_pic（varchar）, // 作者头像
authorNickname（varchar）, // 作者昵称
comments（varchar）, // 留言内容
level（int）, // 留言等级 1-一级 2-二级
higherLevelId（int）, // 上级留言ID
support（int）, // 点赞量
reply（int）, // 回复量

后台登陆历史记录信息表
t_adminhistory:
id（int）, // （自增长）
loginDate（datetime）, // 登陆时间
logoutDate（datetime）, // 登出时间
onlineTime（time）, // 在线时长
userId（int）, // 用户ID
user_pic（varchar）, // 用户头像
nickname（varchar）, // 用户昵称
identity（varchar）, // 用户身份
ps（varchar）, // 备注

审核结果表
t_results:
id（int）， // (自增长)
uid（int）， // 用户id
huid（int）， // 认领/归还人id
claimId（int）， // 失物招领信息id
revertId（int）， // 寻物启事信息id
res（int）， // 结果 0-不符合 1-符合
managerId（int）， // 审核人id
isNotice（int）， // 是否通知 0-未通知 1-已通知

密保信息表
t_protect:
uid（int）, // 用户id
username（varchar）, // 用户账号
lastEditDate（datetime）, // 最后一次修改时间
question_1（varchar）, // 密保问题1
answer_1（varchar）, // 密保答案1
question_2（varchar）, // 密保问题2
answer_2（varchar）, // 密保答案2
question_3（varchar）, // 密保问题3
answer_3（varchar）, // 密保答案3
