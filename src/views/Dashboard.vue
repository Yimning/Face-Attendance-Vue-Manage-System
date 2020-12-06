<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height: 252px">
                    <div class="user-info">
                        <img :src="userAvatar" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{ userInfo.userName }}</div>
                            <div>{{ role }}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        上次登录时间：
                        <span>{{ this.$store.getters.getUser.loginTime }}</span>
                    </div>
                    <div class="user-info-list">
                        上次登录地点：
                        <span>{{ this.$store.getters.getUser.loginPlace }}</span>
                    </div>
                </el-card>
                <el-card shadow="hover" style="height: 252px">
                    <div slot="header" class="clearfix">
                        <span>语言详情</span>
                    </div>
                    Vue <el-progress :percentage="71.3" color="#42b983"></el-progress>JavaScript
                    <el-progress :percentage="24.1" color="#f1e05a"></el-progress>CSS <el-progress :percentage="13.7"></el-progress>HTML
                    <el-progress :percentage="5.9" color="#f56c6c"></el-progress>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20" ref="dateList" :model="recentAttendanceList" v-if="tsRose">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{recentAttendanceList.courseID}}</div>
                                    <div>最近签到课程:{{recentAttendanceList.courseName}}</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">1234</div>
                                    <div>出勤人数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-s-custom grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">5000</div>
                                    <div>缺勤人数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height: 403px" :model="recentCourseList" v-if="tsRose">
                    <div slot="header" class="clearfix">
                        <span>待上课课程</span>
                        <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
                    </div>
                    <el-table :show-header="false" :data="todoList" style="width: 100%">
                        <el-table-column width="40">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.status"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <div class="todo-item" :class="{ 'todo-item-del': scope.row.status }">{{ scope.row.title }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column width="60">
                            <template>
                                <i class="el-icon-edit"></i>
                                <i class="el-icon-delete"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Schart from 'vue-schart';
import bus from '../components/common/bus';
import { timeFix } from '../utils/util';
import StuAttendenceRecordsVue from './SignIn/StuAttendenceRecords.vue';
const weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
export default {
    name: 'dashboard',
    data() {
        return {
            userInfo: this.$store.getters.getUser,
            userAvatar: this.$store.getters.getUser.avatar,
            roseID: this.$store.getters.getUser.roseID,
            roseName: this.$store.getters.getUser.roseName,
            form: {},
            tsRose: false,
            params: {},
            requestUrl: '',
            list: [],
            newArray: [],
            recentAttendanceList:[],
            recentCourseList:[],
            weeks: {
                0: '星期日',
                1: '星期一',
                2: '星期二',
                3: '星期三',
                4: '星期四',
                5: '星期五',
                6: '星期六'
            },
            todoList: [
                {
                    title: '今天要修复100个bug',
                    status: false
                },
                {
                    title: '今天要修复100个bug',
                    status: false
                },
                {
                    title: '今天要写100行代码加几个bug吧',
                    status: false
                },
                {
                    title: '今天要修复100个bug',
                    status: false
                },
                {
                    title: '今天要修复100个bug',
                    status: true
                },
                {
                    title: '今天要写100行代码加几个bug吧',
                    status: true
                }
            ],
            data: [
                {
                    name: '2018/09/04',
                    value: 1083
                },
                {
                    name: '2018/09/05',
                    value: 941
                },
                {
                    name: '2018/09/06',
                    value: 1139
                },
                {
                    name: '2018/09/07',
                    value: 816
                },
                {
                    name: '2018/09/08',
                    value: 327
                },
                {
                    name: '2018/09/09',
                    value: 228
                },
                {
                    name: '2018/09/10',
                    value: 1065
                }
            ],
            options: {
                type: 'bar',
                title: {
                    text: '最近一周各品类销售图'
                },
                xRorate: 25,
                labels: ['周一', '周二', '周三', '周四', '周五'],
                datasets: [
                    {
                        label: '家电',
                        data: [234, 278, 270, 190, 230]
                    },
                    {
                        label: '百货',
                        data: [164, 178, 190, 135, 160]
                    },
                    {
                        label: '食品',
                        data: [144, 198, 150, 235, 120]
                    }
                ]
            },
            options2: {
                type: 'line',
                title: {
                    text: '最近几个月各品类销售趋势图'
                },
                labels: ['6月', '7月', '8月', '9月', '10月'],
                datasets: [
                    {
                        label: '家电',
                        data: [234, 278, 270, 190, 230]
                    },
                    {
                        label: '百货',
                        data: [164, 178, 150, 135, 160]
                    },
                    {
                        label: '食品',
                        data: [74, 118, 200, 235, 90]
                    }
                ]
            }
        };
    },
    components: {
        Schart
    },
    computed: {
        role() {
            return '角色:' + this.roseName;
        }
    },
    created() {
        this.handleListener();
        this.changeDate();
        this.recentAttendanceInfo();
        if (this.$store.getters.getUser.roseID != '2') {
            this.tsRose = true;
        }
        const url = '/api/attendance/findAttendanceInfo';
        if (this.$store.getters.getUser.roseID == '0') {
            this.params = {
                params: {
                    courseID: null,
                    studentNumber: this.$store.getters.getUser.userID,
                    studentName: null,
                    teacherNumber: null,
                    teacherName: null,
                    flag: null,
                    time: null
                }
            };
            this.StuAttendenceRecords(url, this.params);
        }
        if (this.$store.getters.getUser.roseID == '1') {
            this.params = {
                params: {
                    courseID: null,
                    studentNumber: null,
                    studentName: null,
                    teacherNumber: this.$store.getters.getUser.userID,
                    teacherName: null,
                    flag: null,
                    time: null
                }
            };
            this.TeachAttendenceRecords(url, this.params);
        }
    },
    mounted() {
        // 延迟 1 秒显示欢迎信息
        setTimeout(() => {
            this.$notify.success({
                title: '欢迎',
                message: `${timeFix()}，欢迎回来!`
            });
        }, 1000);
    },
    activated() {
        this.handleListener();
    },
    deactivated() {
        window.removeEventListener('resize', this.renderChart);
        bus.$off('collapse', this.handleBus);
    },
    methods: {
        changeDate() {
            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                const date = new Date(now - (6 - index) * 86400000);
                item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            });
        },
        handleListener() {
            bus.$on('collapse', this.handleBus);
            // 调用renderChart方法对图表进行重新渲染
            window.addEventListener('resize', this.renderChart);
        },
        handleBus(msg) {
            setTimeout(() => {
                this.renderChart();
            }, 200);
        },
        renderChart() {
            this.$refs.bar.renderChart();
            this.$refs.line.renderChart();
        },
        recentAttendanceInfo() {},
        StuAttendenceRecords(url, params) {
            const that = this;
            //axios的get请求
            this.$axios
                .get(url, params)
                .then((res) => {
                    this.form = res.data;
                   // console.log('请求后台数据结果', res);
                    console.log('请求后台数据', this.dataTraversal(this.form));
                    this.newArray=this.dataTraversal(this.form);
                   this.recentAttendanceList = this.newArray[0];
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        TeachAttendenceRecords(url, params) {
            const that = this;
            //axios的get请求
            this.$axios
                .get(url, params)
                .then((res) => {
                     this.form = res.data;
                   // console.log('请求后台数据结果', res);
                    console.log('请求后台数据', this.dataTraversal(this.form));
                    this.newArray=this.dataTraversal(this.form);
                   this.recentAttendanceList = this.newArray[0];
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        dataTraversal(form) {
            this.list = [];
            this.newArray = [];
            for (const i in form) {
                //console.log('属性:' + i);
                this.$set(this.list, 'recordID', form[i].recordID);
                this.$set(this.list, 'recordTime', form[i].recordTime);
                this.$set(this.list, 'flag', form[i].flag);
                this.$set(this.list, 'weekDay', this.dataDateChange(form[i].recordTime));

                for (const key in form[i].course) {
                    this.$set(this.list, key, form[i].course[key]); //对象新增属性(使用Vue.$set())
                    this.newArray[i] = this.list; //新建数组存放
                }
                for (const key in form[i].student) {
                    //console.log("属性:"+key);
                    this.$set(this.list, key, form[i].student[key]); //对象新增属性(使用Vue.$set())
                    this.newArray[i] = this.list; //新建数组存放
                }
                for (const key in form[i].teacher) {
                    //console.log("属性:"+key);
                    this.$set(this.list, key, form[i].teacher[key]); //对象新增属性(使用Vue.$set())
                    this.newArray[i] = this.list; //新建数组存放
                }
                this.list = []; //循环完必须清空,否则可能会覆盖
            }
            return this.newArray;
        },
        // 时间格式化
        dataFormat(value) {
            if (value != null || value == '') {
                var year = value.substr(0, 4);
                var month = value.substr(5, 2);
                var day = value.substr(8, 2);
                var hour = value.substr(11, 2);
                var min = value.substr(14, 2);
                var second = value.substr(17, 2);
                return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + second;
            } else return null;
        },
        //根据当前的日期显示当前是星期几
        dataDateChange(dateStr) {
            if (dateStr != null || dateStr == '') {
                let date = new Date(dateStr);
                let weekIndex = date.getDay();
                //this.week = this.weeks[weekIndex];
                return this.weeks[weekIndex];
            } else return null;
        },
        GMTToStr: function (time) {
            let date = new Date(time);
            let Str =
                date.getFullYear() +
                '-' +
                (date.getMonth() + 1) +
                '-' +
                date.getDate() +
                ' ' +
                date.getHours() +
                ':' +
                date.getMinutes() +
                ':' +
                date.getSeconds();
            return Str;
        },
        StrToGMT(time) {
            let GMT = new Date(time);
            return GMT;
        }
    }
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
</style>
