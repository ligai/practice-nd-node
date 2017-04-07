$(function () {
    var hrefObj = URI(location.href)
    var URIObj = URI(location.href).search(true);
    for (var p in URIObj) {
        if (URIObj[p] === 'undefined' || URIObj[p] === null) {
            URIObj[p] = '';
        }
    }
    
    // URL中是否有kw参数
    if (URIObj.kw) {
        $('#search-input').val(decodeURIComponent(URIObj.kw));
    }
    

    // 普通检索排序
    if (URIObj.sort) {
        $(".search-sort option[value='" + URIObj.sort + "']").prop('selected', true);
    }
    
    // 如果是学院页，则隐藏学院导航
    if (URIObj.collage) {
        $('.container-xyjg').hide();
    }
    
    // 如果是学科页，则隐藏学科导航
    if (URIObj.subject) {
        $('.container-xkzy').hide();
    }
    
    // 学院名或学科名
    if (URIObj.subject !== undefined && URIObj.subject !== null) {
        // 获取此学科的学院
        $.get('/API/getSubjectInfoById?subject=' + URIObj.subject, function (data) {
            $('#v-collages').show();
            $('#v-subnav').show();
            var data = JSON.parse(data);
            new Vue({
                el: '#v-collages',
                data: {
                    collages: data.colleges
                }
            });
            new Vue({
                el: '#v-subnav',
                data: {
                    subnav: data
                }
            });

            $("#v-subnav-h").html("获奖成果 -- " + data.name);
            $("#v-subnav-x").html("学术快讯 -- " + data.name);
        })
        
    } else if (URIObj.collage !== undefined && URIObj.collage !== null) {
        // 获取此学院的学科
        $.get('/API/getCollegeInfoById?collage=' + URIObj.collage, function (data) {
            $('#v-subjects').show();
            $('#v-subnav').show();
            var data = JSON.parse(data);
            var introMax = data.intro;
            var introMin = ''
            if (introMax.length > 80) {
                introMin = introMax.substring(0, 90)
                introMin += '...';
                data.intro = introMin;
            }
            $("#v-subnav-h").html("获奖成果 -- " + data.name);
            $("#v-subnav-x").html("学术快讯 -- " + data.name);
            new Vue({
                el: '#v-subjects',
                data: {
                    subjects: data.subjects,
                }
            });
            
            new Vue({
                el: '#v-subnav',
                data: {
                    subnav: data,
                    isExpanded: false,
                    status: '展开',
                },
                computed: {
                    hasIntro: function () {
                        if (this.subnav.intro.length) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
                methods: {
                    showMoreIntro: function () {
                        if (this.isExpanded) {
                            this.subnav.intro = introMin;
                            this.isExpanded = false;
                            this.status = '展开';
                        } else {
                            this.subnav.intro = introMax;
                            this.isExpanded = true;
                            this.status = '收缩';
                        }
                    }
                }
            })
        });
    } else {
        // 学院
        $.get('/API/getColleges', function (data) {
            $('#v-collages').show();
            new Vue({
                el: '#v-collages',
                data: {
                    collages: JSON.parse(data)
                }
            })
        })
        
        // 学科
        $.get('/API/getSubjects', function (data) {
            $('#v-subjects').show();
            new Vue({
                el: '#v-subjects',
                data: {
                    subjects: JSON.parse(data),
                    subjectsOthers: JSON.parse(data),
                    showMore: true
                }
            });
        });
    }
    
    (function () {
        var option = null;
        option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : <br/>{c} ({d}%)",
                textStyle: {
                    fontSize: 8
                }
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: '88%',
                    center: ['50%', '50%'],
                    label: {
                        normal: {
                            show: false
                        },
                    },
                    labelLine: {
                        normal: {
                            show: false,
                        },
                    },
                    data: null,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
        // 首页的学院产出分布图
        if ($('#xkccfb-t').length && !URIObj.collage) {
            $.get('/API/getCollegesMapData?subject=' + URIObj.subject + '&start=' + (URIObj.start || '') + '&end=' + (URIObj.end || '') + '&type=' + (URIObj.type || ''), function (data) {
                var oData = JSON.parse(data);
                option.series[0].name = '学院产出分布';
                option.series[0].data = oData.mapData;
                var eCharts = echarts.init(document.getElementById('xkccfb-t'));
                eCharts.setOption(option);
            });
        }

        // 首页的学科产出分布
        if ($("#xkzyccfb-t").length && !URIObj.subject) {
            $.get('/API/getSubjectsMapData?collage=' + (URIObj.collage || '') + '&start=' + URIObj.start + '&end=' + URIObj.end + '&type=' + (URIObj.type || ''), function (data) {
                var oData = JSON.parse(data);
                option.series[0].name = '学科产出分布';
                option.series[0].data = oData.mapData;
                var eCharts = echarts.init(document.getElementById('xkzyccfb-t'));
                eCharts.setOption(option);
            });
        }

        if ($("#jsccfb-t").length) {
            $.get('/API/getTypesMapData?collage=' + URIObj.collage + '&subject=' + URIObj.subject + '&start=' + URIObj.start + '&end=' + URIObj.end, function (data) {
                var oData = JSON.parse(data);
                option.series[0].name = '内容类型分布';
                option.series[0].data = oData.mapData;
                var eCharts = echarts.init(document.getElementById('jsccfb-t'));
                eCharts.setOption(option);
            });
        }
    })();

    
    // 点击展开所有学科
    $('#v-subjects').on('click', '.change-subjects-number', function () {
        if ($('.change-subjects-number span').text() == '展开') {
            $('.change-subjects-number span').text('收缩');
            $('.more-subjects').slideDown();
        } else {
            $('.change-subjects-number span').text('展开');
            $('.more-subjects').slideUp();
        }
        
    });
    
    // Top 8 作者
    if ($('#v-comprehensive-authors').length) {
        $.get('/API/getTopAuthors?sort=comprehensive&limit=8&collage=' + (URIObj.collage || '') + '&subject=' + (URIObj.subject || ''), function (data) {
            $('#v-comprehensive-authors').show();
            var vComprehensiveAuthors = new Vue({
                el: '#v-comprehensive-authors',
                data: {
                    authors: JSON.parse(data)
                }
            })
        })
    }
    
    // 获取内容类型
    if ($('#v-types').length) {
        $.get('/API/getTypes?collage=' + (URIObj.collage || '') + '&subject=' + (URIObj.subject || ''), function (data) {
            $('#v-types').show();
            new Vue({
                el: '#v-types',
                data: {
                    types: JSON.parse(data)
                }
            });
            $('#v-types li a').each(function () {
                //$(this).attr('href', URI($(this).attr('href')).setSearch({'start': $(this).text(), 'end': $(this).text()}))
                if (URIObj.collage) {
                    $(this).attr('href', URI($(this).attr('href')).setSearch({'collage': URIObj.collage, 'maptype': 2}))
                } else if (URIObj.subject) {
                    $(this).attr('href', URI($(this).attr('href')).setSearch({'subject': URIObj.subject, 'maptype': 1}))
                } else {
                    $(this).attr('href', URI($(this).attr('href')).setSearch({'maptype': 1}))
                }
            });
        });
        
    }
    
    
    // 获取学术快讯
    if ($('#v-academic-news').length) {
        $.get('/API/getAcademicNews?limit=8&collage=' + URIObj.collage + '&subject=' + URIObj.subject, function (data) {
            $('#v-academic-news').show();
            new Vue({
                el: '#v-academic-news',
                data: {
                    academicNews: JSON.parse(data)
                }
            })
        })
    }
    
    
    // 获取获奖成果
    if ($('#v-achievements').length) {
        $.get('/API/getAchievements?limit=8&collage=' + URIObj.collage + '&subject=' + URIObj.subject, function (data) {
            $('#v-achievements').show();
            new Vue({
                el: '#v-achievements',
                data: {
                    achievements: JSON.parse(data)
                }
            })
        })
    }
    
    
    // 教师发文量TOP20
    if ($('#v-number-authors').length) {
        $.get('/API/getTopAuthors?sort=number&limit=20&collage=' + URIObj.collage + '&subject=' + URIObj.subject, function (data) {
            $('#v-number-authors').show();
            new Vue({
                el: '#v-number-authors',
                data: {
                    authors: JSON.parse(data)
                }
            })
        })
    }
    
    
    // 引用论文TOP20
    if ($('#v-articlesByReference').length) {
        $.get('/API/getArticleByCitations?limit=10&collage=' + URIObj.collage + '&subject=' + URIObj.subject, function (data) {
            $('#v-articlesByReference').show();
            new Vue({
                el: '#v-articlesByReference',
                data: {
                    articles: JSON.parse(data)
                }
            })
        })
    }
    
    
    var mapQuery = ''
    if (URIObj.subject) {
        mapQuery += '&subject=' + URIObj.subject
    }
    if (URIObj.collage) {
        mapQuery += '&collage=' + URIObj.collage
    }
    // 图
    if ($('#v-map-year').length) {
        $.get('/API/getYears?' + mapQuery, function (data) {
            $('#v-map-year').show();
            new Vue({
                el: '#v-map-year',
                data: {
                    years: JSON.parse(data)
                }
            })
            
            var yearURL = '';
            if (URIObj.collage) {
                yearURL = '/map?' + mapQuery + '&maptype=2&view=data';
            } else if (URIObj.subject) {
                yearURL = '/map?' + mapQuery + '&maptype=1&view=data';
            } else {
                yearURL = '/map?' + mapQuery + '&maptype=1&view=data';
            }
            // new Vue({
            //     el: '#v-map-year',
            //     data: {
            //         url: yearURL
            //     }
            // })
            $('#v-map-year li a').each(function () {
                $(this).attr('href', yearURL + '&start=' + $(this).attr('val') + '&end=' + $(this).attr('val'))
                //$(this).attr('href', URI($(this).attr('href')).setSearch({'start': $(this).text(), 'end': $(this).text()}))
            });
        })
    }
    
    // $('#v-map-year li a').each(function () {
    //     //$(this).attr('href', URI($(this).attr('href'))
    //     //$(this).attr('href', URI($(this).attr('href')).setSearch({'start': $(this).text(), 'end': $(this).text()}))
    // });
    
    // if ($('#v-types').length) {
    //     var typeURL = '';
    //     if (URIObj.collage) {
    //         typeURL = '/map?' + mapQuery + '&maptype=2&view=data';
    //     } else if (URIObj.subject) {
    //         typeURL = '/map?' + mapQuery + '&maptype=1&view=data';
    //     } else {
    //          typeURL = '/map?' + mapQuery + '&maptype=1&view=data';
    //     }
    //     new Vue({
    //         el: '#v-types',
    //         data: {
    //             url: typeURL
    //         }
    //     })
        
    // }
    
    new Vue({
        el: '#v-map-preview-college',
        data: {
            url: '/map?' + mapQuery + '&maptype=1',
        },
        computed: {
            isCollegePage: function () {
                if (URIObj.collage !== undefined && URIObj.collage !== null) {
                    return true;
                }
                return false;
            }
        }
    });
    new Vue({
        el: '#v-map-preview-subject',
        data: {
            url: '/map?' + mapQuery + '&maptype=2',
        },
        computed: {
            isSubjectPage: function () {
                if (URIObj.subject !== undefined && URIObj.subject !== null) {
                    return true;
                }
                return false;
            }
        }
    })
    new Vue({
        el: '#v-map-preview-author',
        data: {
            url: '/map?' + mapQuery + '&maptype=3'
        }
    })
    new Vue({
        el: '#v-map-preview-type',
        data: {
            url: '/map?' + mapQuery + '&maptype=4'
        }
    })
    new Vue({
        el: '#v-map-preview-time',
        data: {
            url: '/map?' + mapQuery + '&maptype=5'
        }
    })
    
    // 下载排行
    if ($('.v-articlesByDownload').length) {
        $.get('/API/getArticlesByDownload?limit=10&collage=' + (URIObj.collage || '') + '&subject=' + (URIObj.subject || ''), function (data) {
            $('.v-articlesByDownload').show();
            new Vue({
                el: '.v-articlesByDownload',
                data: {
                    articles: JSON.parse(data)
                }
            })
        })
    }
    
    
    
    if ($('.v-articlesByDownloadMonth').length) {
        $.get('/API/getArticlesByDownload?period=month&limit=10&collage=' + (URIObj.collage || '') + '&subject=' + (URIObj.subject || ''), function (data) {
            //$('.v-articlesByDownloadMonth').show();
            new Vue({
                el: '.v-articlesByDownloadMonth',
                data: {
                    articles: JSON.parse(data)
                }
            })
        })
    }
    
    
    
    if ($('.v-articlesByDownloadWeek').length) {
        $.get('/API/getArticlesByDownload?period=week&limit=10&collage=' + (URIObj.collage || '') + '&subject=' + (URIObj.subject || ''), function (data) {
            //$('.v-articlesByDownloadWeek').show();
            new Vue({
                el: '.v-articlesByDownloadWeek',
                data: {
                    articles: JSON.parse(data)
                }
            })
        })
    }
    
    
    // 站点统计
    if ($('#v-site-stats').length) {
        $.get('/API/getSiteStats', function (data) {
            $('#v-site-stats').show();
            new Vue({
                el: '#v-site-stats',
                data: {
                    siteStats: JSON.parse(data)
                }
            })
        })
    }
    
    
    // 获奖成果详情页
    if ($('#v-achievementById').length) {
        $.get('/API/getAchievementById?id=' + URIObj.id, function (data) {
            $('#v-achievementById').show();
            new Vue({
                el: '#v-achievementById',
                data: {
                    achievement: JSON.parse(data)
                }
            })
        })
    }
    
    
    // 获奖论文详情页
    if ($('#v-articleById').length) {
        $.get('/API/getArticleById?id=' + URIObj.id+'&type=' + URIObj.type, function (data) {
            $('#v-articleById').show();
            // var articles = new Vue({
            //     el: '#v-articleById',
            //     data: {
            //         article: JSON.parse(data)
            //     },
            //      
            // })
            var html = '';
            var article = JSON.parse(data);
            if (URIObj.type == 'SCI_Journal' || URIObj.type == 'Chinese_Journal') {
                html = '<table class="detail-table-two">'+
                    '<tr>'+
                        '<td class="detail-t-f">题名</td>'+
                        '<td>'+ (article.title ? article.title : '') +'</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">关键词</td>'+
                        '<td>' + (article.keywords ? article.keywords : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">期刊名称</td>'+
                        '<td>' + (article.journal ? article.journal : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">出版年</td>'+
                        '<td>' + (article.year ? article.year : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">卷起编号</td>'+
                        '<td> ' + (article.volume ? article.volume : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">所在页码</td>'+
                        '<td> ' + article.startPage  + '- ' + article.endPage + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">全文文件</td>'+
                        '<td>' + (article.downloadURL ? article.downloadURL : '') + ' </td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">作者</td>'+
                        '<td>' + (article.authors ? article.authors : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">英文摘要</td>'+
                        '<td>' + (article.en_abstract ? article.en_abstract : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">中文摘要</td>'+
                        '<td>' + (article.zh_abstract ? article.zh_abstract : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">百度引用量</td>'+
                        '<td>' + (article.baiduCitation ? article.baiduCitation : 0) + ' </td>'+
                    '</tr>'+
                '</table>';
            } else if (URIObj.type == 'Thesis') {
                html = '<table class="detail-table-two">'+
                    '<tr>'+
                        '<td class="detail-t-f">题名</td>'+
                        '<td>'+ (article.title ? article.title : '') +'</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">作者</td>'+
                        '<td>' + (article.author ? article.author : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">中文摘要</td>'+
                        '<td>' + (article.zh_abstract ? article.zh_abstract : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">英文摘要</td>'+
                        '<td>' + (article.en_abstract ? article.en_abstract : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">指导老师</td>'+
                        '<td> ' + (article.teachers ? article.teachers : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">所属学院</td>'+
                        '<td> ' + (article.org ? article.org : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">所属学科</td>'+
                        '<td>' + (article.discipline ? article.discipline : '') + ' </td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">学位名称</td>'+
                        '<td>' + (article.degree ? article.degree : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">提交日期</td>'+
                        '<td>' + (article.date ? article.date : '') + '</td>'+
                    '</tr>'+
                '</table>';
            } else if (URIObj.type == 'Book') {
                html = '<table class="detail-table-two">'+
                    '<tr>'+
                        '<td class="detail-t-f">题名</td>'+
                        '<td>'+ (article.title ? article.title : '') +'</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">作者</td>'+
                        '<td>' + (article.authors ? article.authors : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">主题词</td>'+
                        '<td>' + (article.theme ? article.theme : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">中图分类号</td>'+
                        '<td>' + (article.clc ? article.clc : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">出版者</td>'+
                        '<td> ' + (article.publisher ? article.publisher : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">出版日期</td>'+
                        '<td> ' + (article.date ? article.date : '') + '</td>'+
                    '</tr>'+
                '</table>';
            } else if (URIObj.type == 'Achievement') {
                html = '<table class="detail-table-two">'+
                    '<tr>'+
                        '<td class="detail-t-f">题名</td>'+
                        '<td>'+ (article.title ? article.title : '') +'</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">成果完成人</td>'+
                        '<td>' + (article.authors ? article.authors : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">成果完成单位</td>'+
                        '<td>' + (article.org ? article.org : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">所属学科</td>'+
                        '<td>' + (article.discipline ? article.discipline : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">成果简介</td>'+
                        '<td> ' + (article.abstract ? article.abstract : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">成果完成_登记年</td>'+
                        '<td> ' + (article.date ? article.date : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">获奖情况</td>'+
                        '<td>'+ article.award.replace(/<[^>]+>/g,"") +' </td>'+
                    '</tr>'+
                '</table>';
                console.log(article.award);
            } else if (URIObj.type == 'Patent') {
                html = '<table class="detail-table-two">'+
                    '<tr>'+
                        '<td class="detail-t-f">题名</td>'+
                        '<td>'+ (article.title ? article.title : '') +'</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">发明人</td>'+
                        '<td>' + (article.authors ? article.authors : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">专利分类号</td>'+
                        '<td>' + (article.pc ? article.pc : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">专利申请号</td>'+
                        '<td>' + (article.apn ? article.apn : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">摘要</td>'+
                        '<td> ' + (article.abstract ? article.abstract : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">所属学院</td>'+
                        '<td> ' + (article.org ? article.org : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">所属学科</td>'+
                        '<td> ' + (article.discipline ? article.discipline : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">公告日期</td>'+
                        '<td> ' + (article.date ? article.date : '') + '</td>'+
                    '</tr>'+
                '</table>';
            } else if (URIObj.type == 'Project') {
                html = '<table class="detail-table-two">'+
                    '<tr>'+
                        '<td class="detail-t-f">题名</td>'+
                        '<td>'+ (article.title ? article.title : '') +'</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">主持人</td>'+
                        '<td>' + (article.authors ? article.authors : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">项目来源</td>'+
                        '<td>' + (article.source ? article.source : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">所属学院</td>'+
                        '<td>' + (article.org ? article.org : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="detail-t-f">所属学科</td>'+
                        '<td> ' + (article.discipline ? article.discipline : '') + '</td>'+
                    '</tr>'+
                '</table>';
            }

            $('#article-title').attr('title', article.title);
            $('#article-title').text(article.title);
            $('.detail-content').html(html);
        })
    }
    
    
    // 学术快讯详情页
    if ($('#v-newById').length) {
        $.get('/API/getNewById?id=' + URIObj.id, function (data) {
            $('#v-newById').show();
            new Vue({
                el: '#v-newById',
                data: {
                    new: JSON.parse(data)
                }
            })
        })
    }
    
    
    // 检索
    $('#search-btn').click(function () {
        var searchInput = $.trim($('#search-input').val());
        if (searchInput === '') {
            $('#search-input').focus();
            return;
        }
        location.href = '/search?kw=' + encodeURIComponent(searchInput);
    });
    $(document).keydown(function (e) {
        if (e.keyCode === 13 && $('#search-input').is(':focus')) {
            $('#search-btn').trigger('click');
        }
    });
    // 检索结果
    if ($('#v-searchResult').length) {
        $('body').append('<div id="loading"><img src="/img/loading.gif"></div>')
        $.get('/API/search?kw=' + encodeURIComponent(URIObj.kw) + '&page=' + (URIObj.page || '') + '&sort=' + (URIObj.sort || '') + '&r=' + Math.random(), function (data) {
            $('#loading').remove();
            var tempData = JSON.parse(data);
            for (var i = 0; i < tempData.list.length; i++) {
                switch (tempData.list[i].type) {
                    case 'SCI论文':
                    tempData.list[i].enType = 'SCI_Journal';
                    break;
                    case '中文期刊论文':
                    tempData.list[i].enType = 'Chinese_Journal';
                    break;
                    case '学位论文':
                    tempData.list[i].enType = 'Thesis';
                    break;
                    case '著作':
                    tempData.list[i].enType = 'Book';
                    break;
                    case '成果':
                    tempData.list[i].enType = 'Achievement';
                    break;
                    case '专利':
                    tempData.list[i].enType = 'Patent';
                    break;
                    case '项目':
                    tempData.list[i].enType = 'Project';
                    break;
                }
            }
            var vSearchResult = new Vue({
                el: '#v-searchResult',
                data: {
                    result: tempData
                }
            })
            $('.search-result-display').show();
            
            // 分页
            var total = parseInt(vSearchResult.result.total);
            //var page = parseInt(vSearchResult.result.page);
            var page = URIObj.page || 1;
            var pre = parseInt(vSearchResult.result.pre);
            total = Math.ceil(total/pre);
            var show = 10;
            var first = parseInt(paging(total, page, pre, show).first);
            var last = parseInt(paging(total, page, pre, show).last);
            
            $('.search-result-page').html(pageHTML(page, first, last, total, URI))
            
        })
    }
    
    // 排序
    $('.search-sort').change(function () {
        location.href = URI(location.href).removeSearch(['page', 'pre']).setSearch('sort', $('.search-sort').val())
    })
    
    // 高级检索
    
    // 检索条件初始化
    var tempConditionDOM = $('<tr class="adsearch-condition-item"> <td> <select class="search-form adsearch-condition-logic"> <option value="AND">AND</option> <option value="OR">OR</option> <option value="NOT">NOT</option> </select> </td> <td> <select class="search-form adsearch-condition-field"> <option value="ALL">ALL</option> <option value="title">题名</option> <option value="author">作者</option> <option value="kw">关键词</option> </select> </td> <td> <input type="text" class="search-form search-text adsearch-condition-kw"/> <span class="adserch-item-btn adserch-item-addbtn">+</span> <span class="adserch-item-btn adserch-item-delbtn">-</span> </td> </tr>')
    for (var i = 1; true; i++) {
            tempConditionDOM = $('<tr class="adsearch-condition-item"> <td> <select class="search-form adsearch-condition-logic"> <option value="AND">AND</option> <option value="OR">OR</option> <option value="NOT">NOT</option> </select> </td> <td> <select class="search-form adsearch-condition-field"> <option value="ALL">ALL</option> <option value="title">题名</option> <option value="author">作者</option> <option value="kw">关键词</option> </select> </td> <td> <input type="text" class="search-form search-text adsearch-condition-kw"/> <span class="adserch-item-btn adserch-item-addbtn">+</span> <span class="adserch-item-btn adserch-item-delbtn">-</span> </td> </tr>')
        if (hrefObj.hasQuery('kw' + i)) {
            tempConditionDOM.find('.adsearch-condition-logic option[value=' + URIObj['logic' + i] + ']').prop('selected', true);
            tempConditionDOM.find('.adsearch-condition-field option[value=' + URIObj['field' + i] + ']').prop('selected', true);
            tempConditionDOM.find('.adsearch-condition-kw').val(URIObj['kw' + i]);
            $('.adsearch-condition-time').before(tempConditionDOM);
        } else {
            break;
        }
    }
    if (!hrefObj.hasQuery('kw1')) {
        $('.adsearch-condition-time').before(tempConditionDOM);
    } else {
        $('#adsearch-result-right').show()
        // 高级检索结果
        
        if ($('#v-adSearchResult').length) {
            $('body').append('<div id="loading"><img src="/img/loading.gif"></div>')
            $.get('/API/adsearch' + hrefObj.search(), function (data) {
                $('#loading').remove();
                $('#v-adSearchResult').show();
                var vSearchResult = new Vue({
                    el: '#v-adSearchResult',
                    data: {
                        result: JSON.parse(data),
                        page: null,
                    }
                });
                // 分页
                var total = parseInt(vSearchResult.result.total);
                var page = parseInt(URIObj.page ? URIObj.page : 1);
                var pre = parseInt(vSearchResult.result.pre);
                total = Math.ceil(total/pre);
                var show = 10;
                var first = parseInt(paging(total, page, pre, show).first);
                var last = parseInt(paging(total, page, pre, show).last);
                
                $('.search-result-page').html(pageHTML(page, first, last, total, URI))
            })
        }
        
    }
    // 日期初始化
    $('#adsearch-start').val(URIObj['start']);
    $('#adsearch-end').val(URIObj['end']);
    // -
    if ($('#adsearch-conditions').find('.adsearch-condition-item').length <= 1) {
        $('#adsearch-conditions').find('.adserch-item-delbtn').addClass('disabled')
    }
    $('#adsearch-conditions').on('click', '.adserch-item-addbtn', function () {
        var conditionHTML = '<tr class="adsearch-condition-item"> <td> <select class="search-form adsearch-condition-logic"> <option value="AND">AND</option> <option value="OR">OR</option> <option value="NOT">NOT</option> </select> </td> <td> <select class="search-form adsearch-condition-field"> <option value="ALL">ALL</option> <option value="title">题名</option> <option value="author">作者</option> <option value="kw">关键词</option> </select> </td> <td> <input type="text" class="search-form search-text adsearch-condition-kw"/> <span class="adserch-item-btn adserch-item-addbtn">+</span> <span class="adserch-item-btn adserch-item-delbtn">-</span> </td> </tr>';
        $(this).parent().parent().after(conditionHTML);
        $('#adsearch-conditions').find('.adserch-item-delbtn').removeClass('disabled')
    })
    $('#adsearch-conditions').on('click', '.adserch-item-delbtn', function () {
        if ($(this).hasClass('disabled')) return;
        $(this).parent().parent().remove();
        if ($('#adsearch-conditions').find('.adsearch-condition-item').length <= 1) {
            $('#adsearch-conditions').find('.adserch-item-delbtn').addClass('disabled')
        }
    })
    // 点击检索
    $('#adsearch-ok-btn').click(function () {
        var querys = [];
        $('.adsearch-condition-item').each(function (i) {
            var query = {};
            query.logic = $(this).find('.adsearch-condition-logic').val()
            query.field = $(this).find('.adsearch-condition-field').val()
            query.kw = $(this).find('.adsearch-condition-kw').val()
            querys.push(query)
        })
        // 参数对象
        var queryObj = {}
        for (var i = 0; i < querys.length; i++) {
            queryObj['logic' + (i + 1)] = querys[i].logic;
            queryObj['field' + (i + 1)] = querys[i].field;
            queryObj['kw' + (i + 1)] = querys[i].kw;
        }
        queryObj.start = $('#adsearch-start').val()
        queryObj.end = $('#adsearch-end').val()
        
        location.href = URI(location.href).search(queryObj)
    })
    
    // 作者页
    $('.author-types').change(function () {
        var type = $(this).val() ? $(this).val() : 'Chinese_Journal';
        location.href = URI(location.href).setSearch('type', $(this).val())
    })
    if ($('#v-author').length) {
        $.get('/API/getAuthorById?id=' + URIObj.id, function (data) {
            $('.person-introduce').css('visibility', 'visible');
            var vAuthor = new Vue({
                el: '#v-author',
                data: JSON.parse(data)
            })
        });
        
        if (URIObj.view === 'data') {
            $('.author-maps').hide();
            $.get('/API/getAuthorDataList?id=' + (URIObj.id || '') + '&page=' + (URIObj.page || '') + '&sort=' + (URIObj.sort || '') + '&type=' + (URIObj.type || 'Chinese_Journal'), function (data) {
                $('#v-authorData').show();
                var result = JSON.parse(data);
                var vSearchResult = new Vue({
                    el: '#v-authorData',
                    data: {
                        result: JSON.parse(data),
                        page: null,
                        type: URIObj.type,
                    }
                })

                // 分页
                var total = parseInt(vSearchResult.result.total);
                var page = parseInt(URIObj.page ? URIObj.page : 1);
                var pre = parseInt(vSearchResult.result.pre);
                total = Math.ceil(total/pre);
                var show = 10;
                var first = parseInt(paging(total, page, pre, show).first);
                var last = parseInt(paging(total, page, pre, show).last);
                
                $('.search-result-page').html(pageHTML(page, first, last, total, URI))
            })
        } else {
            $('body').append('<div id="loading"><img src="/img/loading.gif"></div>')
            $.get('/API/getAuthorMapDataById?id=' + URIObj.id, function (data) {
                $('#v-author-map').show();
                $('#loading').remove();
                var  vAuthorMap = new Vue({
                    el: '#v-author-map',
                    data: JSON.parse(data)
                })
                
                var authorTypePieChart = echarts.init(document.getElementById('author-type-pie'));
                var authorTyBarChart = echarts.init(document.getElementById('author-type-bar'));
                var keywordsChart = echarts.init(document.getElementById('keywords-chart'));
                
                var typeKeys = [];
                var typeValues = [];
                for (var i = 0; i < vAuthorMap.types.length; i++) {
                    typeKeys.push(vAuthorMap.types[i].name)
                    typeValues.push(vAuthorMap.types[i].value)
                }
                var authorTypePieOption = {
                    title : {
                        text: '科研类型分布饼图',
                        //subtext: '作品总量' + vAuthorMap.$data.total + ' 最后更新时间' + vAuthorMap.$data.update,
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: typeKeys
                    },
                    series : [
                        {
                            name: '科研类型',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data: vAuthorMap.types,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                var authorTypeBarOption = {
                    title : {
                        text: '科研类型分布柱状图',
                        //subtext: '作品总量' + vAuthorMap.$data.total + ' 最后更新时间' + vAuthorMap.$data.update,
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c}"
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    },
                    yAxis: {
                        type: 'category',
                        data: typeKeys
                    },
                    series : [
                        {
                            name: '科研类型',
                            type: 'bar',
                            data: typeValues,
                        }
                    ]
                };
                authorTypePieChart.setOption(authorTypePieOption);
                authorTyBarChart.setOption(authorTypeBarOption);
                
                // 云图
                loadBubble(JSON.parse(data).keywords)
                
                // 时序图
                loadTimeline(JSON.parse(data).topicTime)
        
                
                // 关键词频度图
                
                // 年份
                var keywordsYears = [];
                // 关键词
                var keywords = [];
                var legendWords = [];
                
                for (var i = 0; i < vAuthorMap.keywordTime.length; i++) {
                    var tempKeyword = {};
                    tempKeyword.data = [];
                    tempKeyword.type = 'line';
                    
                    
                    tempKeyword.name = vAuthorMap.keywordTime[i].name;
                    legendWords.unshift(vAuthorMap.keywordTime[i].name)
                    for (var j = 0; j < vAuthorMap.keywordTime[i].yearInfo.length; j++) {
                        tempKeyword.data.unshift(vAuthorMap.keywordTime[i].yearInfo[j].number);
                        if ($.inArray(vAuthorMap.keywordTime[i].yearInfo[j].year, keywordsYears) == -1) {
                            keywordsYears.unshift(vAuthorMap.keywordTime[i].yearInfo[j].year)
                        }
                    }
                    keywords.push(tempKeyword);
                }
                
                var keywordsOption = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: legendWords
                    },
                    xAxis:  {
                        type: 'category',
                        boundaryGap: false,
                        data: keywordsYears
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    series: keywords
                };
                keywordsChart.setOption(keywordsOption)
            });
        }
        
        
        
        
    }
    
    
    //年份
    if ($('.w-yearRange').length) {
        $.get('/API/getYearsRange', function (data) {
            var yearRange = JSON.parse(data);
            var yearHTML = '<option value="">选择年份</option>'
            for (var i = yearRange.end; i >= yearRange.start; i--) {
                yearHTML += '<option value="' + i + '">' + i + '年</option>';
            }
            $('.w-yearRange').append($(yearHTML));
            
            $('.w-yearRange-start option[value=' + URIObj.start + ']').prop('selected', true)
            $('.w-yearRange-end option[value=' + URIObj.end + ']').prop('selected', true)
        })
    }
    
    
    // 学院
    if ($('.w-collages').length) {
        $.get('/API/getColleges', function (data) {
            var collages = JSON.parse(data);
            var collageHTML = '<option value="">选择学院</option>'
            for (var i = 0; i < collages.length; i++) {
                collageHTML += '<option value="' + collages[i].id + '">' + collages[i].name + '</option>';
            }
            $('.w-collages').append($(collageHTML));
            $('.w-collages option[value="' + URIObj.collage + '"]').prop('selected', true)
        })
    }
    
    // 类型
    if ($('.w-types').length) {
        $.get('/API/getTypes', function (data) {
            var types = JSON.parse(data);
            var typeHTML = '<option value="">选择类型</option>'
            // var typeHTML = ''
            for (var i = 0; i < types.length; i++) {
                typeHTML += '<option value="' + types[i].id + '">' + types[i].name + '</option>';
            }
            $('.w-types').append($(typeHTML));
            $('.w-types option[value="' + URIObj.type + '"]').prop('selected', true)
        })
    }
    
    
    // 学科
    if ($('.w-subjects').length) {
        $.get('/API/getSubjects', function (data) {
            var subjects = JSON.parse(data);
            var subjectHTML = '<option value="">选择学科</option>'
            for (var i = 0; i < subjects.length; i++) {
                subjectHTML += '<option value="' + subjects[i].id + '">' + subjects[i].name + '</option>';
            }
            $('.w-subjects').append($(subjectHTML));
            $('.w-subjects option[value="' + URIObj.subject + '"]').prop('selected', true)
        })
    }
    
    
    // 学院产出图
    var eChart = null;
    var eChart2 = null;
    var option = null;
    var option2 = null;
    var option3 = null;
    if ($('#w-map-wrap').length) {
        eChart = echarts.init(document.getElementById('w-map-wrap'));
        option = {
            title : {
                text: '',
                subtext: '',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: null
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data: null,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    }
    if ($('#w-map-wrap2').length) {
        eChart2 = echarts.init(document.getElementById('w-map-wrap2'));
        // option2 = {
        //     title : {
        //         text: '',
        //         subtext: '',
        //         x:'center'
        //     },
        //     tooltip : {
        //         trigger: 'item',
        //         formatter: "{a} <br/>{b} : {c}"
        //     },
        //     grid: {
        //         left: '3%',
        //         right: '4%',
        //         bottom: '3%',
        //         containLabel: true
        //     },
        //     xAxis: {
        //         type: 'value',
        //         boundaryGap: [0, 0.01]
        //     },
        //     yAxis: {
        //         type: 'category',
        //         data: null
        //     },
        //     series : [
        //         {
        //             name: '科研类型',
        //             type: 'bar',
        //             data: null,
        //         }
        //     ]
        // };


        option2 = {
            title: {
                text: '',
                subtext: '',
                x: 'center'
            },
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                left: 'center',
                y:"bottom",
                itemGap: 5,
                itemHeight: '8',
                data: null
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {type: ['line', 'bar']}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: null,
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}',
                }
            },
            series: []
        };

    }
    
    // 如果是学院页，隐藏学院分布图
    if (URIObj.collage) {
        $('.knowledge-top-ul-li[dis-only="works"]').hide();
    }
    // 如果是学科页，隐藏学科分布图
    if (URIObj.subject) {
        $('.knowledge-top-ul-li[dis-only="output"]').hide();
    }
    
    // 学院产出图
     if (URIObj.maptype === '2') {
        $(".knowledge-top-ul-li[dis-only='output']").addClass('knowledge-active');
        $('.knowledge-condition').hide()
        $('#output').show()
        $.get('/API/getSubjectsMapData?collage=' + (URIObj.collage || '') + '&start=' + URIObj.start + '&end=' + URIObj.end + '&type=' + (URIObj.type || ''), function (data) {
            var oDate = JSON.parse(data);
            
            var mapDateKeys = [];
            var mapDateValues = [];
            for (var i = 0; i < oDate.mapData.length; i++) {
                mapDateKeys.push(oDate.mapData[i].name)
                mapDateValues.push(oDate.mapData[i].value)
            }
            
            option.title.text = '学科产出分布饼图'
            option.title.subtext = '作品总量' + oDate.total + ' 最后更新时间' + oDate.update
            option.legend.data = mapDateKeys
            option.series[0].name = '学科产出分布'
            option.series[0].data = oDate.mapData
            
            // option2.title.text = '学科产出分布柱状图'
            // option2.title.subtext = '作品总量' + oDate.total + ' 最后更新时间' + oDate.update
            // option2.yAxis.data = mapDateKeys
            // option2.series[0].name = '学科产出分布'
            // option2.series[0].data = mapDateValues
            
            eChart.setOption(option);
        })

        $.get('/API/getSubjectTimeMap?type=' + (URIObj.type || '') +'&start=' + (URIObj.start || '') +'&end=' + (URIObj.end || '') + '&collage=' + (URIObj.collage || ''), function (data) {
            var sData = JSON.parse(data);
            var sTime = [];
            var sName = [];
            for (var i = 0; i < sData.mapData[0].data.length; i++) {
                sTime.push(sData.mapData[0].data[i].year);
            }

            for (var i = 0; i < sData.mapData.length; i++) {
                var series = {
                    name: sData.mapData[i].name,
                    type: 'line',
                    data: null
                };
                sData.mapData[i].data.sort(sortNumber);
                var oneData = [];
                for (var j = 0; j < sData.mapData[i].data.length; j++) {
                    oneData.push(sData.mapData[i].data[j].value);
                }
                series.data = oneData;
                option2.series.push(series);
                sName.push(sData.mapData[i].name);
            }
            sTime = sTime.sort();
            option2.title.text = '学科产出时间序列图';
            option2.title.subtext = '作品总量' + sData.total + ' 最后更新时间' + sData.update;
            option2.legend.data = sName;
            option2.xAxis.data = sTime;
            eChart2.setOption(option2);
        });
        
    } else if (URIObj.maptype === '3') {
        $(".knowledge-top-ul-li[dis-only='type']").addClass('knowledge-active');
        $('.knowledge-condition').hide()
        $('#type').show()
        $('#w-authorCooperateMap').html('')
        
        $.get('/API/getAuthorCooperateMapData?collage=' + URIObj.collage  + '&subject=' + URIObj.subject + '&start=' + URIObj.start + '&end=' + URIObj.end, function (data) {
            var graph = JSON.parse(data);
            for(var i in graph.links) {
                graph.links[i].source = Number(findNodeIndex(graph.links[i].source, graph.nodes))
                graph.links[i].target = Number(findNodeIndex(graph.links[i].target, graph.nodes))
            }
            
            var width = 775,
                height = 800;
            
            var values = []
            graph.nodes.forEach(function (d) {
                values.push(d.production);
            })
            var minValue = d3.min(values);
            var maxValue = d3.max(values);
            
            var color = d3.scale.category20();
            
            var force = d3.layout.force()
                .charge(-180)
                .linkDistance(100)
                .size([width, height]);
            
            var svg = d3.select("#w-authorCooperateMap").append("svg")
                .attr("width", width)
                .attr("height", height);
            
            force
                .nodes(graph.nodes)
                .links(graph.links)
                .start();
            
            var link = svg.selectAll(".link")
                .data(graph.links)
                .enter().append("line")
                .attr("class", "link")
                .style("stroke-width", function(d) { return Math.sqrt(d.value); });
            
            
            var node = svg.selectAll(".node")
                .data(graph.nodes)
                .enter().append("circle")
                .attr("class", "node")
                .attr("r", function (d) {return ((d.production - minValue)*(30 - 3)/(maxValue - minValue) + 5)})
                .style("fill", function(d) { return d.color; })
                .call(force.drag);
                
                //((d.production - minValue)*(20 - 5)/(maxValue - minValue) + 5)
            
            node.append("title")
                .text(function(d) { return d.group + ':' + d.name + '[' + d.production + ']'; });
            
            var svg_texts = svg.selectAll("text")
                .data(graph.nodes)
                .enter()
                .append("text")
                    .attr("dy", ".3em")
                    .style("text-anchor", "middle")
                    .style('font-size', "10px")
                .html(function(d){
                    return '<a href="/authors?view=data&id=' + d.id + '" target="_blank">' + d.name + '</a>';
                })
                .call(force.drag);
                
            svg_texts.append("title")
                .text(function(d) { return d.group + ':' + d.name + '[' + d.production + ']'; });
                
            force.on("tick", function() {
                link.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });
            
                node.attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
                    
                svg_texts.attr("x", function(d){ return d.x; })
                .attr("y", function(d){ return d.y; });
                });
            
        })
        
        
    } else if (URIObj.maptype === '4') {
        $(".knowledge-top-ul-li[dis-only='type2']").addClass('knowledge-active');
        $('.knowledge-condition').hide()
        $('#type2').show()
        $.get('/API/getTypesMapData?collage=' + URIObj.collage + '&subject=' + URIObj.subject + '&start=' + URIObj.start + '&end=' + URIObj.end, function (data) {
            var oDate = JSON.parse(data);
            
            var mapDateKeys = [];
            var mapDateValues = [];
            for (var i = 0; i < oDate.mapData.length; i++) {
                mapDateKeys.push(oDate.mapData[i].name)
                mapDateValues.push(oDate.mapData[i].value)
            }
            
            option.title.text = '内容类型分布饼图'
            option.title.subtext = '作品总量' + oDate.total + ' 最后更新时间' + oDate.update
            option.legend.data = mapDateKeys
            option.series[0].name = '内容类型分布'
            option.series[0].data = oDate.mapData
            
            // option2.title.text = '内容类型分布柱状图'
            // option2.title.subtext = '作品总量' + oDate.total + ' 最后更新时间' + oDate.update
            // option2.yAxis.data = mapDateKeys
            // option2.series[0].name = '内容类型分布'
            // option2.series[0].data = mapDateValues
            
            eChart.setOption(option);
            
        })

        $.get('/API/getTypeTimeMap?collage=' + (URIObj.collage || '') + '&subject=' + (URIObj.subject || '') + '&start=' + (URIObj.start || '') + '&end=' + (URIObj.end || ''), function (data) {
            var pData = JSON.parse(data);
            console.log(pData);
            var pTime = [];
            var pName = [];
            for (var i = 0; i < pData.mapData[0].data.length; i++) {
                pTime.push(pData.mapData[0].data[i].year);
            } 

            for (var i = 0; i < pData.mapData.length; i++) {
                var series = {
                    name: pData.mapData[i].name,
                    type: 'line',
                    data: []
                };
                var oneData = [];
                pData.mapData[i].data.sort(sortNumber);
                for (var j = 0; j < pData.mapData[i].data.length; j++) {
                    series.data.push(pData.mapData[i].data[j].value);
                }
                pName.push(pData.mapData[i].name);
                option2.series.push(series);
            }

            pTime = pTime.sort();
            option2.title.text = '内容类型时间序列图';
            option2.title.subtext = '作品总量' + pData.total + ' 最后更新时间' + pData.update;
            option2.legend.data = pName;
            option2.xAxis.data = pTime;
            eChart2.setOption(option2);
        });

    } else if (URIObj.maptype === '1') {
        $('.knowledge-top-ul-li[dis-only="works"]').addClass('knowledge-active');
        $('.knowledge-condition').hide()
        $('#works').show()
        $.get('/API/getCollegesMapData?subject=' + URIObj.subject + '&start=' + (URIObj.start || '') + '&end=' + (URIObj.end || '') + '&type=' + (URIObj.type || ''), function (data) {
            var oDate = JSON.parse(data);
            
            var mapDateKeys = [];
            var mapDateValues = [];
            for (var i = 0; i < oDate.mapData.length; i++) {
                mapDateKeys.push(oDate.mapData[i].name)
                mapDateValues.push(oDate.mapData[i].value)
            }
            
            option.title.text = '学院产出分布饼图'
            option.title.subtext = '作品总量' + oDate.total + ' 最后更新时间' + oDate.update
            option.legend.data = mapDateKeys
            option.series[0].name = '学院产出分布'
            option.series[0].data = oDate.mapData
            
            // option2.title.text = '学院产出分布柱状图'
            // option2.title.subtext = '作品总量' + oDate.total + ' 最后更新时间' + oDate.update
            // option2.yAxis.data = mapDateKeys
            // option2.series[0].name = '学院产出分布'
            // option2.series[0].data = mapDateValues
            
            eChart.setOption(option);
            
        })

        $.get('/API/getCollegeTimeMap?type=' + (URIObj.type || '') +'&start=' + (URIObj.start || '') +'&end=' + (URIObj.end || '') + '&subject=' + (URIObj.subject || ''), function (data) {
            var cData = JSON.parse(data);
            var cTime = [];
            var cName = [];
            for (var i = 0; i < cData.mapData[0].data.length ; i++) {
                cTime.push(cData.mapData[0].data[i].year);
            }
            
            for (var i = 0; i < cData.mapData.length; i++) {
                var oneData = [];
                var series = {
                    name: cData.mapData[i].name,
                    type: 'line',
                    data: null
                }
                cData.mapData[i].data.sort(sortNumber);
                for (var j = 0; j < cData.mapData[i].data.length; j++) {
                    oneData.push(cData.mapData[i].data[j].value);
                }
                series.data = oneData;
                option2.series.push(series);
                cName.push(cData.mapData[i].name);
            }
            cTime = cTime.sort();
            option2.title.text = '学院产出时间序列图';
            option2.title.subtext = '作品总量' + cData.total + ' 最后更新时间' + cData.update;
            option2.xAxis.data = cTime;
            option2.legend.data = cName;
            eChart2.setOption(option2);
        })
    } else if (URIObj.maptype === '5') {
        $('.knowledge-top-ul-li[dis-only="type3"]').addClass('knowledge-active');
        $('.knowledge-condition').hide();
        $('#type3').show();
        $.get('/API/getYearsMapData?collage=' + URIObj.collage + '&subject=' + URIObj.subject + '&start=' + (URIObj.start || '') + '&end=' + (URIObj.end || '') + '&subject=' + (URIObj.subject || '') + '&type=' + (URIObj.type || ''), function (data) {
            var oDate = JSON.parse(data);
            
            var mapDateKeys = [];
            var mapDateValues = [];
            for (var i = 0; i < oDate.mapData.length; i++) {
                mapDateKeys.unshift(oDate.mapData[i].year)
                mapDateValues.unshift(oDate.mapData[i].value)
            }
            
            var timeEChart = echarts.init(document.getElementById('w-map-wrap'));
            
            var option = {
                title: {
                    text: '时间分布图',
                    subtext: '作品总量' + oDate.total + ' 最后更新时间' + oDate.update,
                    x:'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    feature: {
                        magicType: {type: ['line', 'bar']},
                    }
                },
                xAxis:  {
                    type: 'category',
                    boundaryGap: false,
                    data: mapDateKeys
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                series: [
                    {
                        name:'产出',
                        type:'line',
                        data: mapDateValues,
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'}
                            ]
                        }
                    }
                ]
            };

            timeEChart.setOption(option);
        });
    }
    
    // 点击图的类型
    $('.knowledge-top-ul-li').click(function () {
        location.href = URI(location.href).setSearch('maptype', $(this).attr('maptype')).removeSearch("page")
    })
    
    // 选择条件改变
    $('.w-yearRange-start').change(function () {
        location.href = URI(location.href).setSearch('start', $(this).val())
    })
    $('.w-yearRange-end').change(function () {
        location.href = URI(location.href).setSearch('end', $(this).val())
    })
    $('.w-types').change(function () {
        location.href = URI(location.href).setSearch('type', $(this).val())
    })
    // $('.w-collages').change(function () {
    //     location.href = URI(location.href).setSearch('collage', $(this).val())
    // })
    
    // $('.w-subjects').change(function () {
    //     location.href = URI(location.href).setSearch('subject', $(this).val())
    // })
    
    // 显示简介
    var gName = '中国农业大学';
    if ($('#v-intro').length) {
        if (URIObj.collage) {
            $.get('/API/getCollegeInfoById?collage=' + URIObj.collage, function (data) {
                data = JSON.parse(data);
                gName = data.name
                $('#v-intro').show();
                new Vue({
                    el: '#v-intro',
                    data: data
                })
            })
        } else if (URIObj.subject) {
            $.get('/API/getSubjectInfoById?subject=' + URIObj.subject, function (data) {
                data = JSON.parse(data);
                gName = data.name
                $('#v-intro').show();
                new Vue({
                    el: '#v-intro',
                    data: data
                })
            })
        } else {
            // $('#v-intro').show();
            // $('#v-intro').html('<h1>农业大学简介</h1><p>从1905年京师大学堂农科大学、到今天的中国农业大学，几代农大人在教学科研活动中取得了丰硕的成果。为了对这些百年积累下来的成果加以保存、研究和交流，图书馆开展了“中国农业大学机构知识库”建设，收集历年来我校教师在教学科研活动中发表的学术论著、培养研究生的学位论文、开展的科研项目、取得的成果、学术报告、教学大纲等多种与教学科研相关联的信息。在精心梳理、加工、整合基础上，构建了包含教师文库、学位论文、博硕士研究生招生专业与导师介绍、以及基于机构知识库的我校10个主流一级学科专题资源服务平台开，开启一个了解百年农大学术成果的窗口。</p>');
        }
    }
    
    // 图对应的数据
    if ($('#v-mapData').length) {
        $.get('/API/getDataListOfMap?subject=' + (URIObj.subject || '') + '&collage=' + (URIObj.collage || '') + '&page=' + (URIObj.page || '') + '&start=' + (URIObj.start || '') + '&end=' + (URIObj.end || '') + '&type=' + URIObj.type + '&sort=' + (URIObj.sort || ''), function (data) {
            if (URIObj.view === 'data') {
                $('#v-mapData').show();
            }
            var vSearchResult = new Vue({
                el: '#v-mapData',
                data: {
                    result: null,
                    page: null,
                    gName: gName,
                }
            })
            
            vSearchResult.result = JSON.parse(data);
            
            // 分页
            var total = parseInt(vSearchResult.result.total);
            var page = parseInt(URIObj.page ? URIObj.page : 1);
            var pre = parseInt(vSearchResult.result.pre);
            total = Math.ceil(total/pre);
            var show = 10;
            var first = parseInt(paging(total, page, pre, show).first);
            var last = parseInt(paging(total, page, pre, show).last);
            
            $('.search-result-page').html(pageHTML(page, first, last, total, URI))
        })
    }
    // 简介
    // if (URIObj.maptype === '2' && URIObj.subject) {
    //     // 根据subject id获取学科信息
    //     // $.get('/API/getCollegeInfoById?collage=' + URIObj.collage, function (data) {
    //     //     data = JSON.parse(data);
    //     //     new Vue({
    //     //         el: '#v-intro',
    //     //         data: data
    //     //     })
    //     // })
        
    //     // 获取学科数据列表
    //     $.get('/API/getDataListOfMap?subject=' + URIObj.subject + '&page=' + URIObj.page + '&start=' + URIObj.start + '&end=' + URIObj.end, function (data) {
    //         var vSearchResult = new Vue({
    //             el: '#v-mapData',
    //             data: {
    //                 result: null,
    //                 page: null,
    //             }
    //         })
            
    //         vSearchResult.result = JSON.parse(data);
            
    //         // 分页
    //         var total = parseInt(vSearchResult.result.total);
    //         var page = parseInt(vSearchResult.result.page);
    //         var pre = parseInt(vSearchResult.result.pre);
    //         total = Math.ceil(total/pre);
    //         var show = 10;
    //         var first = parseInt(paging(total, page, pre, show).first);
    //         var last = parseInt(paging(total, page, pre, show).last);
            
    //         $('.search-result-page').html(pageHTML(page, first, last, total, URI))
    //     })
        
    // } else if (URIObj.maptype !== '2' && URIObj.collage) {
    //     // 根据collage id获取学院信息
    //     // $.get('/API/getCollegeInfoById?collage=' + URIObj.collage, function (data) {
    //     //     data = JSON.parse(data);
    //     //     $('#v-intro').show();
    //     //     new Vue({
    //     //         el: '#v-intro',
    //     //         data: data
    //     //     })
    //     // })
        
    //     // 获取学科数据列表
    //     $.get('/API/getDataListOfMap?collage=' + URIObj.collage + '&page=' + URIObj.page + '&start=' + URIObj.start + '&end=' + URIObj.end, function (data) {
    //         var vSearchResult = new Vue({
    //             el: '#v-mapData',
    //             data: {
    //                 result: null,
    //                 page: null,
    //             }
    //         })
            
    //         vSearchResult.result = JSON.parse(data);
            
    //         // 分页
    //         var total = parseInt(vSearchResult.result.total);
    //         var page = parseInt(vSearchResult.result.page);
    //         var pre = parseInt(vSearchResult.result.pre);
    //         total = Math.ceil(total/pre);
    //         var show = 10;
    //         var first = parseInt(paging(total, page, pre, show).first);
    //         var last = parseInt(paging(total, page, pre, show).last);
            
    //         $('.search-result-page').html(pageHTML(page, first, last, total, URI))
    //     })
        
    // } else {
    //     // 显示学校简介
        
        
    //     // 获取学校数据列表
    //     $.get('/API/getDataListOfMap?page=' + (URIObj.page || ''), function (data) {
    //         var vSearchResult = new Vue({
    //             el: '#v-mapData',
    //             data: {
    //                 result: null,
    //                 page: null,
    //             }
    //         })
            
    //         vSearchResult.result = JSON.parse(data);
            
    //         // 分页
    //         var total = parseInt(vSearchResult.result.total);
    //         var page = parseInt(vSearchResult.result.page);
    //         var pre = parseInt(vSearchResult.result.pre);
    //         total = Math.ceil(total/pre);
    //         var show = 10;
    //         var first = parseInt(paging(total, page, pre, show).first);
    //         var last = parseInt(paging(total, page, pre, show).last);
            
    //         $('.search-result-page').html(pageHTML(page, first, last, total, URI))
    //     })
    // }
    
    if (URIObj.view === 'data') {
        $('.mp-change-view').addClass('data').text('切换到图谱');
        $('#w-authorCooperateMap').hide();
        //$('.map-data-list').show();
        $('.knowledge-top-ul').hide();
        $('.knowledge-condition').hide();
        $('#type4').show();
    } else {
        $('.mp-change-view').removeClass('data').text('切换到数据列表');
        $('#w-authorCooperateMap').show();
        $('.map-data-list').hide();
        $('.knowledge-top-ul').show()
    }
    
    // 切换图谱与数据列表
    $('.mp-change-view').click(function () {
        if (!$(this).hasClass('data')) {
            location.href = URI(location.href).setSearch('view', 'data').setSearch('type', $(this).val());
        } else {
            location.href = URI(location.href).setSearch('view', 'map');
        }
    });
    
    if ($('#v-moreAuthors').length) {
        new Vue({
            el: '#v-moreAuthors',
            data: {
                url: '/authorLists?' + mapQuery,
            }
        })
    }
    
    // 作者列表
    if ($('#authorList-Letters').length) {
        var authorListCurrentLetter = false;
        console.log(URI(location.href));
        var authorListLettersHtml = '';
        for(var i=0; i<26; i++){
            if (URIObj.letter == String.fromCharCode(65+i)) {
                authorListLettersHtml += '<a class="active" href="' + URI(location.href).setSearch({'page': 1, 'letter': String.fromCharCode(65+i)}) + '">' + String.fromCharCode(65+i) + '</a>'
                authorListCurrentLetter = true;
            } else {
                authorListLettersHtml += '<a href="' + URI(location.href).setSearch({'page': 1, 'letter': String.fromCharCode(65+i)}) + '">' + String.fromCharCode(65+i) + '</a>'
            }
            
        }
        if (!authorListCurrentLetter) {
            authorListLettersHtml = '<a class="active" href="' + URI(location.href).setSearch({'page': 1, 'letter': ''}) + '">全部</a>' + authorListLettersHtml;
        } else {
            authorListLettersHtml = '<a href="' + URI(location.href).setSearch({'page': 1, 'letter': ''}) + '">全部</a>' + authorListLettersHtml;
        }
        $('#authorList-Letters').html(authorListLettersHtml);
    }
    
    // 作者列表
    if ($('#v-authorListData').length) {
        $.get('/API/getAuthorList?subject=' + (URIObj.subject || '') + '&collage=' + (URIObj.collage || '') + '&page=' + (URIObj.page || '') + '&pre=' + (URIObj.pre || '10') + '&letter=' + (URIObj.letter || ''), function (data) {
            $('#v-authorListData').show();
            var vSearchResult = new Vue({
                el: '#v-authorListData',
                data: {
                    result: null,
                    page: null,
                }
            })
            
            vSearchResult.result = JSON.parse(data);
            
            // 分页
            var total = parseInt(vSearchResult.result.total);
            var page = parseInt(URIObj.page ? URIObj.page : 1);
            var pre = parseInt(URIObj.pre ? URIObj.pre : 10);
            total = Math.ceil(total/pre);
            var show = 10;
            var first = parseInt(paging(total, page, pre, show).first);
            var last = parseInt(paging(total, page, pre, show).last);
            
            $('.search-result-page').html(pageHTML(page, first, last, total, URI))
        })
    }


    if ($('#feedback').length) {
        new Vue ({
            el: '#feedback',
            data: {
                url: '/feedback?id='+URIObj.id
            }
        });
    }


    // 用户反馈中的内容类型
    if ($('#feed-types').length) {
        $.get('/API/getTypes?collage=' + (URIObj.collage || '') + '&subject=' + (URIObj.subject || ''), function (data) {
            new Vue ({
                el: '#feed-types',
                data: {
                    types: JSON.parse(data),
                }
            });
        });
    }



    //用户反馈
    $("#feedback-btn").click(function (){
        if (!$("#feedback-title").val()) {
            alert("文章标题不能为空!");
            return false;
        } 

        $.post("/sendFeedback?id="+ URIObj.id, $("#feedback-form").serialize(), function (data) {
            if (data.success) {
                alert(data.message);
            }
        });
    });


    // 类型
    if ($('.author-types').length) {
        $.get('/API/getTypes', function (data) {
            var types = JSON.parse(data);
            var typeHTML = ''
            for (var i = 0; i < types.length; i++) {
                if (types[i].id == 'Chinese_Journal') {
                    typeHTML += '<option value="' + types[i].id + '" selected>' + types[i].name + '</option>';
                } else {
                    typeHTML += '<option value="' + types[i].id + '">' + types[i].name + '</option>';
                }
                
            }
            $('.author-types').append($(typeHTML));
            $('.author-types option[value="' + URIObj.type + '"]').prop('selected', true)
        })
    }
    
    /**
     * 2017-03-09
     */
    var path = hrefObj.path()
    if (path === '/') {
      $('.nav__item').eq(0).addClass('nav__item--active')
    } else if (path === '/authorLists') {
      $('.nav__item').eq(1).addClass('nav__item--active')
    }
})










// 分页，获取第一页和最后一页
function paging(total, page, pre, show) {
    var front = Math.ceil(show/2) - 1;
    
    var first = page - front;
    
    if (first < 1) {
        first = 1;
    }
    
    var last = first + show - 1;
    
    if (last > total) {
        last = total;
    }
    
    return {first: first, last: last};
}


// 分页的HTML
function pageHTML(page, first, last, total, URI) {
    var html = '';
    if (page === 1) {
        html += '<li><span>上一页</span></li>';
    } else {
        html += '<li><a href="' + URI(location.href).setSearch('page', page - 1) + '">上一页</a></li>';
    }
    
    for (var i = first; i <= last; i++) {
        if (i == page) {
            html += '<li><span>' + i + '</span></li>';
        } else {
            html += '<li><a href="' + URI(location.href).setSearch('page', i) + '">' + i + '</a></li>';
        }
    }
    
    if (page === total) {
        html += '<li><span>下一页</span></li>';
    } else {
        html += '<li><a href="' + URI(location.href).setSearch('page', parseInt(page) + 1) + '">下一页</a></li>';
    }
    
    return html;
}


function loadBubble(d){
	 var data=d;
	//data=eval(data);
	// alert(data);
	 var diameter = 375,
	    format = d3.format(",d"),
	    color = d3.scale.category20c();

	var bubble = d3.layout.pack()
	    .sort(null)
	    .size([diameter, diameter])
	    .padding(1.5);

	var svg = d3.select("#w-yuntu").append("svg")
	    .attr("width", diameter)
	    .attr("height", diameter)
	    .attr("class", "bubble");


	  var node = svg.selectAll(".node")
	      .data(bubble.nodes(classes(data))
	      .filter(function(d) { return !d.children; }))
	    .enter().append("g")
	      .attr("class", "node")
	      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

	  node.append("title")
	      .text(function(d) { return d.className + ": " + format(d.value); });

	  node.append("circle")
	      .attr("r", function(d) { return d.r; })
	      .style("fill", function(d) { return color(d.className); });

	  node.append("text")
	      .attr("dy", ".3em")
	      .style("text-anchor", "middle")
	      .text(function(d) { return d.className.substring(0, d.r / 3); });


	// Returns a flattened hierarchy containing all leaf nodes under the root.
	function classes(root) {
	  var classes = [];

	  function recurse(name, node) {
	    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
	    else classes.push({packageName: name, className: node.name, value: node.size});
	  }

	  recurse(null, root);
	  return {children: classes};
	}

	d3.select(self.frameElement).style("height", diameter + "px");
 }
 
 function loadTimeline(d){
	 var datum=d;
	 var width = 775;
	 var chart = d3.timeline()
     .stack() // toggles graph stacking
     .margin({left:100, right:30, top:0, bottom:0})
     .tickFormat( //
       {format: d3.time.format("%Y"),
       tickTime: d3.time.years,
       tickInterval: 2,
       tickSize: 3});
     
	 
   var svg = d3.select("#topic-chart").append("svg").attr("width", width)
     .datum(datum).call(chart);
   
   d3.selectAll("rect")
	.append("title")
  .text(function(d) {
     return d.title;
   });
 }

function findNodeIndex(id, nodes){
    for (var i in nodes){
        if (nodes[i]['id'] === id ) return i;
    }
    return -1;
}

function sortNumber (a, b) {
    return  a['year'] - b['year'];
}
