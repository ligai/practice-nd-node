const express = require('express')
const path = require('path')
const http = require('http')
const querystring = require('querystring')
const router = express.Router()

// const host = 'http://10.167.174.215:8080'

// const host = 'http://10.167.175.101:8080'

const host = 'http://36.110.45.46:8090'

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'API.html'))
})

// 获取所有的学院
router.get('/getColleges', (req, res) => {
    // http.get('http://10.167.175.101:8080/CauProject/getColleges', (res) => {
    //     let body = ''
    //     res.on('data', (chunk) => {
    //         body += chunk
    //     });
    //     res.on('end', () => {
    //         //console.log(JSON.parse(body))
    //     })
    // }).on('error', (e) => {
    //     console.log(`Got error: ${e.message}`);
    // });
    httpGet(req, res)
})

// 获取所有的学院
router.get('/getAuthorList', (req, res) => {
    httpGet(req, res)
})

// 获取所有的学科
router.get('/getSubjects', (req, res) => {
    httpGet(req, res)
})

// 根据id获取学院
router.get('/getCollegeById', (req, res) => {
    httpGet(req, res)
})

// 根据id获取学科
router.get('/getSubjectById', (req, res) => {
    httpGet(req, res)
})

// 获取Top作者
router.get('/getTopAuthors', (req, res) => {
    httpGet(req, res)
})

// // 获取内容类型
// router.get('/getTypes', (req, res) => {
//     const data = [
//         {
//             id: 1,
//             name: "SCI论文",
//             number: 921
//         },
//         {
//             id: 2,
//             name: "中文期刊论文",
//             number: 845
//         },
//         {
//             id: 3,
//             name: "学位论文",
//             number: 654
//         },
//         {
//             id: 4,
//             name: "著作",
//             number: 2456
//         },
//         {
//             id: 5,
//             name: "专利",
//             number: 123
//         },
//         {
//             id: 6,
//             name: "项目",
//             number: 2563
//         },
//         {
//             id: 7,
//             name: "成果",
//             number: 3261
//         }
//     ]
    
//     res.send(JSON.stringify(data))
// })

// 获取内容类型
router.get('/getTypes', (req, res) => {
    httpGet(req, res)
})

// 获取学术快讯
router.get('/getAcademicNews', (req, res) => {
    const data = [
        {
            id: 1,
            title: "理学院郭洪超教授课题组在Aldrichimica Acta发表文章",
            date: '2016-03-21'
        },
        {
            id: 2,
            title: "理学院郭洪超教授课题组在Aldri文章",
            date: '2016-03-21'
        },
        {
            id: 3,
            title: "理学院郭洪超教授课题组在Aldrichimica Acta发表文章",
            date: '2016-03-21'
        },
        {
            id: 4,
            title: "理学院郭洪超教授课题组在Aldrica发表文章",
            date: '2016-03-21'
        },
        {
            id: 5,
            title: "理学院郭洪超在Aldrichimica Acta发表文章",
            date: '2016-03-21'
        },
        {
            id: 6,
            title: "理学院授课题组在Aldrichimica Acta发表文章",
            date: '2016-03-21'
        },
        {
            id: 7,
            title: "理学院超教题组在Aldrichimica Acta发表文章",
            date: '2016-03-21'
        },
        {
            id: 8,
            title: "理学院郭洪超教授课题组在Aldrichimica Acta发表文章",
            date: '2016-03-21'
        },
        {
            id: 9,
            title: "理学院郭洪超教授课题组在Aldrichimica Acta发表文章",
            date: '2016-03-21'
        },
        {
            id: 10,
            title: "理学院郭洪超教授课题组在Aldrichimica Acta发表文章",
            date: '2016-03-21'
        },
    ]
    
    res.send(JSON.stringify(data))
})

// 获取获奖成果
router.get('/getAchievements', (req, res) => {
    httpGet(req, res)
})

// 引用论文TOP20
router.get('/getArticleByCitations', (req, res) => {
    httpGet(req, res)
    // const data = [
    //     {
    //         id: 1,
    //         title: "我国农产品期货价格过度波动中的羊群行为研究",
    //     },
    //     {
    //         id: 2,
    //         title: "夹砂层状土条件下渠道渗漏的室内试验和数值模拟",
    //     },
    //     {
    //         id: 3,
    //         title: "现代订单农业中的远期定价及风险管理模式探析",
    //     },
    //     {
    //         id: 4,
    //         title: "微/纳米气泡臭氧水对尖孢镰刀菌的杀灭效果研究",
    //     },
    //     {
    //         id: 5,
    //         title: "荷斯坦牛乳员金黄色葡萄球菌流行性及其与乳源总菌群的耐药性分析",
    //     },
    //     {
    //         id: 6,
    //         title: "新疆自育陆地棉品种SSR遗传多样性分析",
    //     },
    //     {
    //         id: 7,
    //         title: "降温方法对不同采收期鸭梨采后果心褐变和膜脂组分的影响",
    //     },
    //     {
    //         id: 8,
    //         title: "不同产地沙田柚果肉挥发性物质的研究",
    //     },
    //     {
    //         id: 9,
    //         title: "拟南芥LRR-RLKs亚家族蛋白RLK6的亚细胞定位机RLK6的组织表达",
    //     },
    //     {
    //         id: 10,
    //         title: "京冀平原区地块尺度农户耕地集约利用差异对比",
    //     }
    // ]
    
    // res.send(JSON.stringify(data))
})

// 下载排行
router.get('/getArticlesByDownload', (req, res) => {
    const data = [
        {
            id: 1,
            title: "我国农产品期货价格过度波动中的羊群行为研究",
            downloadNumber: 123
        },
        {
            id: 2,
            title: "夹砂层状土条件下渠道渗漏的室内试验和数值模拟",
            downloadNumber: 123
        },
        {
            id: 3,
            title: "现代订单农业中的远期定价及风险管理模式探析",
            downloadNumber: 123
        },
        {
            id: 4,
            title: "微/纳米气泡臭氧水对尖孢镰刀菌的杀灭效果研究",
            downloadNumber: 123
        },
        {
            id: 5,
            title: "荷斯坦牛乳员金黄色葡萄球菌流行性及其与乳源总菌群的耐药性分析",
            downloadNumber: 123
        },
        {
            id: 6,
            title: "新疆自育陆地棉品种SSR遗传多样性分析",
            downloadNumber: 123
        },
        {
            id: 7,
            title: "降温方法对不同采收期鸭梨采后果心褐变和膜脂组分的影响",
            downloadNumber: 123
        },
        {
            id: 8,
            title: "不同产地沙田柚果肉挥发性物质的研究",
            downloadNumber: 123
        },
        {
            id: 9,
            title: "拟南芥LRR-RLKs亚家族蛋白RLK6的亚细胞定位机RLK6的组织表达",
            downloadNumber: 123
        },
        {
            id: 10,
            title: "京冀平原区地块尺度农户耕地集约利用差异对比",
            downloadNumber: 123
        }
    ]
    
    res.send(JSON.stringify(data))
})

// 站点统计
router.get('/getSiteStats', (req, res) => {
    const data = {
        itemNumber: 7120,
        fullTextNumber: 6885,
        PV: 34645783,
        downloadNumber: 395384
    }
    
    res.send(JSON.stringify(data))
})

// 根据id获取成果信息
router.get('/getAchievementById', (req, res) => {
    httpGet(req, res)
})

// 根据id获取论文信息
router.get('/getArticleById', (req, res) => {
    httpGet(req, res)
})

// 根据id获取学术快讯
router.get('/getNewById', (req, res) => {
    const data = {
        title: '首期“大家谈园艺”开讲 伊伟伦院士谈 “植物耐旱能力的定量评估”',
        content: '<span>园艺学院 2016年04月06日报道</span><br> <p>4月5日晚六点半，园艺学院“大家谈园艺” 讲坛第一期于西区土化楼174教师举行。中国工程院院士、原北京林业大学校长易伟伦教授受邀作专题报告。报告会由学院党委书记初春霖主持。</p> <p>4月5日晚六点半，园艺学院“大家谈园艺” 讲坛第一期于西区土化楼174教师举行。中国工程院院士、原北京林业大学校长易伟伦教授受邀作专题报告。报告会由学院党委书记初春霖主持。</p> <p>4月5日晚六点半，园艺学院“大家谈园艺” 讲坛第一期于西区土化楼174教师举行。中国工程院院士、原北京林业大学校长易伟伦教授受邀作专题报告。报告会由学院党委书记初春霖主持。</p> <p>4月5日晚六点半，园艺学院“大家谈园艺” 讲坛第一期于西区土化楼174教师举行。中国工程院院士、原北京林业大学校长易伟伦教授受邀作专题报告。报告会由学院党委书记初春霖主持。</p> <p>4月5日晚六点半，园艺学院“大家谈园艺” 讲坛第一期于西区土化楼174教师举行。中国工程院院士、原北京林业大学校长易伟伦教授受邀作专题报告。报告会由学院党委书记初春霖主持。</p> <p>4月5日晚六点半，园艺学院“大家谈园艺” 讲坛第一期于西区土化楼174教师举行。中国工程院院士、原北京林业大学校长易伟伦教授受邀作专题报告。报告会由学院党委书记初春霖主持。</p> <p>4月5日晚六点半，园艺学院“大家谈园艺” 讲坛第一期于西区土化楼174教师举行。中国工程院院士、原北京林业大学校长易伟伦教授受邀作专题报告。报告会由学院党委书记初春霖主持。</p> <p>4月5日晚六点半，园艺学院“大家谈园艺” 讲坛第一期于西区土化楼174教师举行。中国工程院院士、原北京林业大学校长易伟伦教授受邀作专题报告。报告会由学院党委书记初春霖主持。</p> <p>4月5日晚六点半，园艺学院“大家谈园艺” 讲坛第一期于西区土化楼174教师举行。中国工程院院士、原北京林业大学校长易伟伦教授受邀作专题报告。报告会由学院党委书记初春霖主持。</p>', 
    }
    
    res.send(JSON.stringify(data))
})

// 普通检索
router.get('/search', (req, res) => {
    httpGet(req, res)
})

// 高级检索
router.get('/adsearch', (req, res) => {
    httpGet(req, res)
    // const data = {
    //     total: 2480,
    //     page: req.query.page !== "undefined" ? req.query.page : 1,
    //     pre: 10,
    //     list: [
    //         {
    //             title: 'A Bibliometric Framework for Identifying "Princes" Who Wake up the "Sleeping Beauty" In Challenge-type Scientific Discoveries',
    //             id: 1,
    //             type: '期刊论文',
    //             abstract: 'Journal of Data and Information Science,2016,卷号:9,期号:1,页码:50-68',
    //             author: ['Jian Du', 'Yishan Wu'],
    //             downloadURL: 'http://upload.hljtv.com/2014/1010/1412922501915.jpg',
    //             size: '2578Kb',
    //             pv: 16,
    //             downloadNumber: 2,
    //         },
    //         {
    //             title: 'A Bibliometric Framework for Identifying "Princes" Who Wake up the "Sleeping Beauty" In Challenge-type Scientific Discoveries',
    //             id: 1,
    //             type: '期刊论文',
    //             abstract: 'Journal of Data and Information Science,2016,卷号:9,期号:1,页码:50-68',
    //             author: ['Jian Du', 'Yishan Wu'],
    //             downloadURL: 'http://upload.hljtv.com/2014/1010/1412922501915.jpg',
    //             size: '2578Kb',
    //             pv: 16,
    //             downloadNumber: 2,
    //         },
    //         {
    //             title: 'A Bibliometric Framework for Identifying "Princes" Who Wake up the "Sleeping Beauty" In Challenge-type Scientific Discoveries',
    //             id: 1,
    //             type: '期刊论文',
    //             abstract: 'Journal of Data and Information Science,2016,卷号:9,期号:1,页码:50-68',
    //             author: ['Jian Du', 'Yishan Wu'],
    //             downloadURL: 'http://upload.hljtv.com/2014/1010/1412922501915.jpg',
    //             size: '2578Kb',
    //             pv: 16,
    //             downloadNumber: 2,
    //         },
    //         {
    //             title: 'A Bibliometric Framework for Identifying "Princes" Who Wake up the "Sleeping Beauty" In Challenge-type Scientific Discoveries',
    //             id: 1,
    //             type: '期刊论文',
    //             abstract: 'Journal of Data and Information Science,2016,卷号:9,期号:1,页码:50-68',
    //             author: ['Jian Du', 'Yishan Wu'],
    //             downloadURL: 'http://upload.hljtv.com/2014/1010/1412922501915.jpg',
    //             size: '2578Kb',
    //             pv: 16,
    //             downloadNumber: 2,
    //         },
    //         {
    //             title: 'A Bibliometric Framework for Identifying "Princes" Who Wake up the "Sleeping Beauty" In Challenge-type Scientific Discoveries',
    //             id: 1,
    //             type: '期刊论文',
    //             abstract: 'Journal of Data and Information Science,2016,卷号:9,期号:1,页码:50-68',
    //             author: ['Jian Du', 'Yishan Wu'],
    //             downloadURL: 'http://upload.hljtv.com/2014/1010/1412922501915.jpg',
    //             size: '2578Kb',
    //             pv: 16,
    //             downloadNumber: 2,
    //         },
    //         {
    //             title: 'A Bibliometric Framework for Identifying "Princes" Who Wake up the "Sleeping Beauty" In Challenge-type Scientific Discoveries',
    //             id: 1,
    //             type: '期刊论文',
    //             abstract: 'Journal of Data and Information Science,2016,卷号:9,期号:1,页码:50-68',
    //             author: ['Jian Du', 'Yishan Wu'],
    //             downloadURL: 'http://upload.hljtv.com/2014/1010/1412922501915.jpg',
    //             size: '2578Kb',
    //             pv: 16,
    //             downloadNumber: 2,
    //         },
    //         {
    //             title: 'A Bibliometric Framework for Identifying "Princes" Who Wake up the "Sleeping Beauty" In Challenge-type Scientific Discoveries',
    //             id: 1,
    //             type: '期刊论文',
    //             abstract: 'Journal of Data and Information Science,2016,卷号:9,期号:1,页码:50-68',
    //             author: ['Jian Du', 'Yishan Wu'],
    //             downloadURL: 'http://upload.hljtv.com/2014/1010/1412922501915.jpg',
    //             size: '2578Kb',
    //             pv: 16,
    //             downloadNumber: 2,
    //         },
    //         {
    //             title: 'A Bibliometric Framework for Identifying "Princes" Who Wake up the "Sleeping Beauty" In Challenge-type Scientific Discoveries',
    //             id: 1,
    //             type: '期刊论文',
    //             abstract: 'Journal of Data and Information Science,2016,卷号:9,期号:1,页码:50-68',
    //             author: ['Jian Du', 'Yishan Wu'],
    //             downloadURL: 'http://upload.hljtv.com/2014/1010/1412922501915.jpg',
    //             size: '2578Kb',
    //             pv: 16,
    //             downloadNumber: 2,
    //         },
    //         {
    //             title: 'A Bibliometric Framework for Identifying "Princes" Who Wake up the "Sleeping Beauty" In Challenge-type Scientific Discoveries',
    //             id: 1,
    //             type: '期刊论文',
    //             abstract: 'Journal of Data and Information Science,2016,卷号:9,期号:1,页码:50-68',
    //             author: ['Jian Du', 'Yishan Wu'],
    //             downloadURL: 'http://upload.hljtv.com/2014/1010/1412922501915.jpg',
    //             size: '2578Kb',
    //             pv: 16,
    //             downloadNumber: 2,
    //         },
    //         {
    //             title: 'A Bibliometric Framework for Identifying "Princes" Who Wake up the "Sleeping Beauty" In Challenge-type Scientific Discoveries',
    //             id: 1,
    //             type: '期刊论文',
    //             abstract: 'Journal of Data and Information Science,2016,卷号:9,期号:1,页码:50-68',
    //             author: ['Jian Du', 'Yishan Wu'],
    //             downloadURL: 'http://upload.hljtv.com/2014/1010/1412922501915.jpg',
    //             size: '2578Kb',
    //             pv: 16,
    //             downloadNumber: 2,
    //         }
    //     ]
    // }
    
    // res.send(JSON.stringify(data))
})

// 根据id获取作者信息
router.get('/getAuthorById', (req, res) => {
    // const data = {
    //     name: '高俊平',
    //     icon: 'http://upload.hljtv.com/2014/1010/1412922501915.jpg',
    //     total: 7120,
    //     update: '2016-04-27',
    //     collage: '农学与生物技术学院',
    //     firstLevelSubject: ['林学', '园艺学'],
    //     secondLevelSubject: ['园林植物与观赏园艺', '观赏园艺学'],
    //     keywords: {
    //         "children": [
    //             {
    //                 "name": "socialware",
    //                 "size": 2
    //             },
    //             {
    //                 "name": "染色体",
    //                 "size": 3
    //             },
    //             {
    //                 "name": "マルチエージェントシステム",
    //                 "size": 12
    //             },
    //             {
    //                 "name": "共生コンピューティング",
    //                 "size": 3
    //             },
    //             {
    //                 "name": "Network Management",
    //                 "size": 8
    //             },
    //             {
    //                 "name": "ハーストパラメータ",
    //                 "size": 3
    //             },
    //             {
    //                 "name": "ユーザインタフェース",
    //                 "size": 3
    //             },
    //             {
    //                 "name": "発展型エージェントシステム",
    //                 "size": 4
    //             },
    //             {
    //                 "name": "symbiotic computing",
    //                 "size": 2
    //             },
    //             {
    //                 "name": "グラフ",
    //                 "size": 2
    //             },
    //             {
    //                 "name": "agent",
    //                 "size": 5
    //             },
    //             {
    //                 "name": "active information resource",
    //                 "size": 4
    //             },
    //             {
    //                 "name": "組織再構成",
    //                 "size": 3
    //             },
    //             {
    //                 "name": "マルチエージェント",
    //                 "size": 6
    //             },
    //             {
    //                 "name": "Evolutional Agent System",
    //                 "size": 3
    //             },
    //             {
    //                 "name": "エージェント",
    //                 "size": 11
    //             },
    //             {
    //                 "name": "multiagent",
    //                 "size": 3
    //             },
    //             {
    //                 "name": "Pox Diagram",
    //                 "size": 4
    //             },
    //             {
    //                 "name": "ソーシャルウェア",
    //                 "size": 3
    //             },
    //             {
    //                 "name": "能動的情報資源",
    //                 "size": 11
    //             },
                
    //         ]
    //     },
    //     workExperience: [
    //         '1985,08～1987,09 西北农业大学园艺系，助教',
    //         '1985,08～1987,09 西北农业大学园艺系，助教',
    //         '1985,08～1987,09 西北农业大学园艺系，助教'
    //     ],
    //     studyExperience: [
    //         '学习1985,08～1987,09 西北农业大学园艺系，助教',
    //         '学习1985,08～1987,09 西北农业大学园艺系，助教',
    //         '学习1985,08～1987,09 西北农业大学园艺系，助教'
    //     ],
    //     courseExperience: [
    //         '课程1985,08～1987,09 西北农业大学园艺系，助教',
    //         '课程1985,08～1987,09 西北农业大学园艺系，助教',
    //         '课程1985,08～1987,09 西北农业大学园艺系，助教'
    //     ],
    //     types: [
    //         {
    //             name: 'SCI论文',
    //             value: 20,
    //         },
    //         {
    //             name: '中文期刊论文',
    //             value: 15,
    //         },
    //         {
    //             name: '学位论文',
    //             value: 8,
    //         },
    //         {
    //             name: '著作',
    //             value: 9,
    //         },
    //         {
    //             name: '专利',
    //             value: 12,
    //         },
    //     ],
    //     topicTime: [
    //         {
    //             label: "观赏园艺",
    //             times: [
    //                 {
    //                     title: "观赏园艺",
    //                     "starting_time": 895593600000,
    //                     "ending_time": 927129600000
    //                 }
    //             ]
    //         },
    //         {
    //             label: "观赏园艺观赏园艺",
    //             times: [
    //                 {
    //                     title: "观赏园艺观赏园艺",
    //                     "starting_time": 927129600000,
    //                     "ending_time": 1358352000000
    //                 }
    //             ]
    //         },
    //         {
    //             label: "观赏",
    //             times: [
    //                 {
    //                     title: "观赏",
    //                     "starting_time": 1093449600000,
    //                     "ending_time": 1298822400000
    //                 }
    //             ]
    //         },
    //         {
    //             label: "观赏观赏",
    //             times: [
    //                 {
    //                     title: "观赏观赏",
    //                     "starting_time": 1093536000000,
    //                     "ending_time": 1164211200000
    //                 }
    //             ]
    //         },
    //         {
    //             label: "观赏观赏",
    //             times: [
    //                 {
    //                     title: "观赏观赏",
    //                     "starting_time": 1105286400000,
    //                     "ending_time": 1347465600000
    //                 }
    //             ]
    //         }
    //     ]
    // }
    
    // res.send(JSON.stringify(data))
    httpGet(req, res)
})

// 获取有效的年份信息
router.get('/getYearsRange', (req, res) => {
    const data = {
        'start': 1980,
        'end': 2016
    }
    
    res.send(JSON.stringify(data))
})

// 获取学院产出分布图数据
router.get('/getCollegesMapData', (req, res) => {
    httpGet(req, res)
})

// 获取学科产出分布图数据
router.get('/getSubjectsMapData', (req, res) => {
    httpGet(req, res)
})

// 获取内容类型分布图数据
router.get('/getTypesMapData', (req, res) => {
    httpGet(req, res)
})

// 获取作者合作图谱数据
router.get('/getAuthorCooperateMapData', (req, res) => {
    httpGet(req, res)
})

// 根据subject id获取学科信息
router.get('/getSubjectInfoById', (req, res) => {
    httpGet(req, res)
})

// 根据collage id获取学院信息
router.get('/getCollegeInfoById', (req, res) => {
    httpGet(req, res)
})

// 普通检索
router.get('/getDataListOfMap', (req, res) => {
    httpGet(req, res)
    // const data = {
    //     total: 1234,
    //     page: req.query.page !== "undefined" ? req.query.page : 1,
    //     pre: 10,
    //     list: [
    //         {
    //             title: 'A Bibliometric Framework for Identifying "Princes" Who Wake up the "Sleeping Beauty" In Challenge-type Scientific Discoveries',
    //             id: 1,
    //             type: '期刊论文',
    //             abstract: 'Journal of Data and Information Science,2016,卷号:9,期号:1,页码:50-68',
    //             author: ['Jian Du', 'Yishan Wu'],
    //             downloadURL: 'http://upload.hljtv.com/2014/1010/1412922501915.jpg',
    //             size: '2578Kb',
    //             pv: 16,
    //             downloadNumber: 2,
    //         },
    //         {
    //             title: 'A Bibliometric Framework for Identifying "Princes" Who Wake up the "Sleeping Beauty" In Challenge-type Scientific Discoveries',
    //             id: 1,
    //             type: '期刊论文',
    //             abstract: 'Journal of Data and Information Science,2016,卷号:9,期号:1,页码:50-68',
    //             author: ['Jian Du', 'Yishan Wu'],
    //             downloadURL: 'http://upload.hljtv.com/2014/1010/1412922501915.jpg',
    //             size: '2578Kb',
    //             pv: 16,
    //             downloadNumber: 2,
    //         },
    //         {
    //             title: 'A Bibliometric Framework for Identifying "Princes" Who Wake up the "Sleeping Beauty" In Challenge-type Scientific Discoveries',
    //             id: 1,
    //             type: '期刊论文',
    //             abstract: 'Journal of Data and Information Science,2016,卷号:9,期号:1,页码:50-68',
    //             author: ['Jian Du', 'Yishan Wu'],
    //             downloadURL: 'http://upload.hljtv.com/2014/1010/1412922501915.jpg',
    //             size: '2578Kb',
    //             pv: 16,
    //             downloadNumber: 2,
    //         },
    //         {
    //             title: 'A Bibliometric Framework for Identifying "Princes" Who Wake up the "Sleeping Beauty" In Challenge-type Scientific Discoveries',
    //             id: 1,
    //             type: '期刊论文',
    //             abstract: 'Journal of Data and Information Science,2016,卷号:9,期号:1,页码:50-68',
    //             author: ['Jian Du', 'Yishan Wu'],
    //             downloadURL: 'http://upload.hljtv.com/2014/1010/1412922501915.jpg',
    //             size: '2578Kb',
    //             pv: 16,
    //             downloadNumber: 2,
    //         },
    //         {
    //             title: 'A Bibliometric Framework for Identifying "Princes" Who Wake up the "Sleeping Beauty" In Challenge-type Scientific Discoveries',
    //             id: 1,
    //             type: '期刊论文',
    //             abstract: 'Journal of Data and Information Science,2016,卷号:9,期号:1,页码:50-68',
    //             author: ['Jian Du', 'Yishan Wu'],
    //             downloadURL: 'http://upload.hljtv.com/2014/1010/1412922501915.jpg',
    //             size: '2578Kb',
    //             pv: 16,
    //             downloadNumber: 2,
    //         },
    //         {
    //             title: 'A Bibliometric Framework for Identifying "Princes" Who Wake up the "Sleeping Beauty" In Challenge-type Scientific Discoveries',
    //             id: 1,
    //             type: '期刊论文',
    //             abstract: 'Journal of Data and Information Science,2016,卷号:9,期号:1,页码:50-68',
    //             author: ['Jian Du', 'Yishan Wu'],
    //             downloadURL: 'http://upload.hljtv.com/2014/1010/1412922501915.jpg',
    //             size: '2578Kb',
    //             pv: 16,
    //             downloadNumber: 2,
    //         },
    //         {
    //             title: 'A Bibliometric Framework for Identifying "Princes" Who Wake up the "Sleeping Beauty" In Challenge-type Scientific Discoveries',
    //             id: 1,
    //             type: '期刊论文',
    //             abstract: 'Journal of Data and Information Science,2016,卷号:9,期号:1,页码:50-68',
    //             author: ['Jian Du', 'Yishan Wu'],
    //             downloadURL: 'http://upload.hljtv.com/2014/1010/1412922501915.jpg',
    //             size: '2578Kb',
    //             pv: 16,
    //             downloadNumber: 2,
    //         },
    //         {
    //             title: 'A Bibliometric Framework for Identifying "Princes" Who Wake up the "Sleeping Beauty" In Challenge-type Scientific Discoveries',
    //             id: 1,
    //             type: '期刊论文',
    //             abstract: 'Journal of Data and Information Science,2016,卷号:9,期号:1,页码:50-68',
    //             author: ['Jian Du', 'Yishan Wu'],
    //             downloadURL: 'http://upload.hljtv.com/2014/1010/1412922501915.jpg',
    //             size: '2578Kb',
    //             pv: 16,
    //             downloadNumber: 2,
    //         },
    //         {
    //             title: 'A Bibliometric Framework for Identifying "Princes" Who Wake up the "Sleeping Beauty" In Challenge-type Scientific Discoveries',
    //             id: 1,
    //             type: '期刊论文',
    //             abstract: 'Journal of Data and Information Science,2016,卷号:9,期号:1,页码:50-68',
    //             author: ['Jian Du', 'Yishan Wu'],
    //             downloadURL: 'http://upload.hljtv.com/2014/1010/1412922501915.jpg',
    //             size: '2578Kb',
    //             pv: 16,
    //             downloadNumber: 2,
    //         },
    //         {
    //             title: 'A Bibliometric Framework for Identifying "Princes" Who Wake up the "Sleeping Beauty" In Challenge-type Scientific Discoveries',
    //             id: 1,
    //             type: '期刊论文',
    //             abstract: 'Journal of Data and Information Science,2016,卷号:9,期号:1,页码:50-68',
    //             author: ['Jian Du', 'Yishan Wu'],
    //             downloadURL: 'http://upload.hljtv.com/2014/1010/1412922501915.jpg',
    //             size: '2578Kb',
    //             pv: 16,
    //             downloadNumber: 2,
    //         }
    //     ]
    // }
    
    // res.send(JSON.stringify(data))
})

// 获取时间分布图数据
router.get('/getYearsMapData', (req, res) => {
    httpGet(req, res)
})

// 获取作者数据列表
router.get('/getAuthorDataList', (req, res) => {
    httpGet(req, res)
})

// 获取作者数据列表
router.get('/getAuthorMapDataById', (req, res) => {
    httpGet(req, res)
})

// 
router.get('/getYears', (req, res) => {
    httpGet(req, res)
})


//学院产出时间序列
router.get('/getCollegeTimeMap', (req, res) => {
    httpGet(req, res);
})

// 学科产出时间序列
router.get('/getSubjectTimeMap', (req, res) => {
    httpGet(req, res);
})

// 内容类型时间序列
router.get('/getTypeTimeMap', (req, res) => {
    httpGet(req, res);
});

router.get('/getUserInfo', (req, res) => {
    var path = "http://10.167.173.116:3030" + req.originalUrl;
    // console.log(path);
    http.get(path, (response) => {
        var body = ''
        response.on('data', (chunk) => {
            body += chunk
        })
        response.on('end', () => {
            res.send(body)
        })
    }).on('error', (e) => {
        console.log(`Got error: ${e.message}`)
    })
});


function httpGet(req, res) {
    console.log(host + req.originalUrl)
    // var options = {  
	//     hostname: '10.167.32.133',  // 代理域名
	//     port: 8080,    //代理端口号
	//     path: host + req.originalUrl,  
	//     method: 'GET',  
	//     headers: {  
	//         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'  
	//     }  
	// }; 
    http.get(host + req.originalUrl, (response) => {
        var body = ''
        response.on('data', (chunk) => {
            body += chunk
        })
        response.on('end', () => {
            res.send(body)
        })
    }).on('error', (e) => {
        console.log(`Got error: ${e.message}`)
    })
}

module.exports = router