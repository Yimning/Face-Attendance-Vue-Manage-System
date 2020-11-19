<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 全部学生选课 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>

                <el-select v-model="QueryConditions.courseID" placeholder="课程号-课程名" class="mr10">
                    <el-option
                        el-option
                        v-for="item in QueryConditions"
                        :key="item.courseID"
                        :label="item.courseID"
                        :value="item.courseID"
                    ></el-option>
                </el-select>

                <el-select v-model="selected" placeholder="查询条件" class="handle-select mr10">
                    <el-option key="查教师号" label="教师号" value="0"></el-option>
                    <el-option key="查教师姓名" label="教师姓名" value="1"></el-option>
                    <el-option key="查查学生学号" label="查学生学号" value="2"></el-option>
                    <el-option key="查学生姓名" label="学生姓名" value="3"></el-option>
                </el-select>

                <el-input
                    v-model="query.request"
                    v-if="selected === '0'"
                    placeholder="教师号"
                    class="handle-input mr10"
                    @keyup.enter.native="handleSearch"
                    id="messageInput"
                    v-on:input="inputFunc"
                    clearable
                ></el-input>
                <!-- @keyup.enter 但是若在组件框架中写需要加.native -->
                <el-input
                    v-model="query.request"
                    v-else-if="selected === '1'"
                    placeholder="输入教师姓名"
                    class="handle-input mr10"
                    @keyup.enter.native="handleSearch"
                    id="messageInput"
                    v-on:input="inputFunc"
                    clearable
                ></el-input>
                <el-input
                    v-model="query.request"
                    v-else-if="selected === '2'"
                    placeholder="学生学号"
                    class="handle-input mr10"
                    @keyup.enter.native="handleSearch"
                    id="messageInput"
                    v-on:input="inputFunc"
                    clearable
                ></el-input>
                <!-- @keyup.enter 但是若在组件框架中写需要加.native -->
                <el-input
                    v-model="query.request"
                    v-else
                    placeholder="输入学生姓名"
                    class="handle-input mr10"
                    @keyup.enter.native="handleSearch"
                    id="messageInput"
                    v-on:input="inputFunc"
                    clearable
                ></el-input>
                <div class="handle-weekday">
                    <el-col :span="7">
                        <el-date-picker
                            type="date"
                            placeholder="选择日期"
                            v-model="QueryConditions.weekDay"
                            value-format="yyyy-MM-dd"
                            style="width: 100%"
                            v-on:input="inputFuncDay"
                        ></el-date-picker>
                    </el-col>
                    <el-input v-model="QueryConditions.IsDay" placeholder="" class="handle-input mr10" disabled></el-input>

                    <el-button class="" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                    <!-- <el-button type="success" icon="el-icon-circle-plus" @click="handleAdd">添加课程</el-button> -->
                </div>

                <download-excel
                    class="handleUpload"
                    :fields="json_fields"
                    :data="multipleSelection"
                    :before-generate="startDownload"
                    :before-finish="finishDownload"
                    type="xls"
                >
                    <el-button type="info" icon="el-icon-download">导出</el-button>
                    <!-- <el-button type="info" icon="el-icon-download" @click="handleAllUpload">全部导出</el-button> -->
                </download-excel>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="40" align="center"></el-table-column>
                <el-table-column prop="recordID" label="记录号" width="55" align="center"></el-table-column>
                <el-table-column prop="studentNumber" label="学号" align="center"></el-table-column>
                <el-table-column prop="studentName" label="姓名" align="center"></el-table-column>
                <el-table-column prop="studentSex" label="性别" width="55" align="center"> </el-table-column>
                <el-table-column prop="studentClass" label="班号" width="55" align="center"></el-table-column>
                <el-table-column prop="profession" label="专业" align="center"></el-table-column>
                <el-table-column prop="courseID" label="课程号" width="55" align="center"></el-table-column>
                <el-table-column prop="courseName" label="课程名" align="center"></el-table-column>
                <el-table-column prop="teacherName" label="授课教师" align="center"></el-table-column>
                <el-table-column prop="recordTime" label="签到时间" align="center"></el-table-column>
                <el-table-column prop="weekDay" label="星期" align="center"></el-table-column>
                <el-table-column prop="flag" label="是否已签" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-more" class="blue" @click="handleMore(scope.$index, scope.row)"
                            >详情</el-button
                        >
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">补签</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.currentPage"
                    :page-size="query.pageSize"
                    :total="query.pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <!-- 编辑详情框 -->
        <el-dialog title="个人信息" :visible.sync="moreVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="班号">
                    <el-input v-model="form.studentClass" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="学号">
                    <el-input v-model="form.studentNumber" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.studentName" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-input v-model="form.studentSex" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="专业">
                    <el-input v-model="form.profession" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="身份证号">
                    <el-input v-model="form.cardNo" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="加入时间">
                    <el-input v-model="form.joinTime" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <el-input v-model="form.studentAvatar" readonly="readonly"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="moreVisible = false">取 消</el-button>
                <el-button type="primary" @click="moreVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="班号">
                    <el-input v-model="form.studentClass"></el-input>
                </el-form-item>
                <el-form-item label="学号">
                    <el-input v-model="form.studentNumber" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.studentName"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <!-- <el-input v-model="formAdd.studentSex"></el-input> -->
                    <el-radio v-model="form.studentSex" label="男">男</el-radio>
                    <el-radio v-model="form.studentSex" label="女">女</el-radio>
                </el-form-item>
                <el-form-item label="专业">
                    <el-input v-model="form.profession"></el-input>
                </el-form-item>
                <el-form-item label="身份证号">
                    <el-input v-model="form.cardNo"></el-input>
                </el-form-item>
                <el-form-item label="加入时间">
                    <div class="block">
                        <span class="demonstration"></span>
                        <el-date-picker v-model="form.joinTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="头像">
                    <el-input v-model="form.studentAvatar" readonly="readonly"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!--添加弹出框 -->
        <el-dialog title="添加" :visible.sync="addVisible" width="30%">
            <el-form ref="formAdd" :model="formAdd" label-width="70px">
                <el-form-item label="班号">
                    <el-input v-model="formAdd.studentClass"></el-input>
                </el-form-item>
                <el-form-item label="学号">
                    <el-input v-model="formAdd.studentNumber" placeholder="必填项"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="formAdd.studentName" placeholder="必填项"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <!-- <el-input v-model="formAdd.studentSex"></el-input> -->
                    <el-radio v-model="formAdd.studentSex" label="男">男</el-radio>
                    <el-radio v-model="formAdd.studentSex" label="女">女</el-radio>
                </el-form-item>
                <el-form-item label="专业">
                    <el-input v-model="formAdd.profession"></el-input>
                </el-form-item>
                <el-form-item label="身份证号">
                    <el-input v-model="formAdd.cardNo"></el-input>
                </el-form-item>
                <el-form-item label="加入时间">
                    <div class="block">
                        <span class="demonstration"></span>
                        <el-date-picker v-model="formAdd.joinTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="初始密码">
                    <el-input v-model="formAdd.studentPassword" placeholder="必填项"></el-input>
                </el-form-item>
                <el-form-item label="默认头像">
                    <el-input v-model="form.studentAvatar" readonly="readonly" placeholder="后台会选择默认头像,此项无需操作"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData, AvatarData } from '../../api/index';
import JsonExcel from 'vue-json-excel';
const weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                address: '',
                name: '',
                currentPage: 1,
                pageSize: 5,
                pageTotal: 0,
                request: ''
            },
            form: {
                options: []
            },
            timeValue: '',
            input: '',
            newArray: [],
            QueryConditions: {
                IsDay: '',
                courseID:'',
            },
            multipleSelection: [],
            list: [{}],
            json_fields: {
                学号: 'studentNumber',
                姓名: 'studentName',
                性别: 'studentSex',
                班号: 'studentClass',
                专业: 'profession',
                课程号: 'courseID',
                课程名: 'courseName',
                授课教师: 'teacherName'
            },
            weeks: {
                0: '星期日',
                1: '星期一',
                2: '星期二',
                3: '星期三',
                4: '星期四',
                5: '星期五',
                6: '星期六'
            },
            requestAddr: '',
            selected: '0', //注意数据格式的转换，否则会导致不正常
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            moreVisible: false,
            addVisible: false,
            showOrNot: false,
            courseOrNot: true,
            stuNumberOrNot: true,
            form: {},
            formAdd: {},
            defaultAvatar: {},
            idx: -1,
            id: -1
        };
    },
    components: {
        'download-excel': JsonExcel
    },
    created() {
        this.getData(); //渲染
        this.getAllCourse();
        AvatarData(this.defaultAvatar).then((res) => {
            // console.log(res.avatar[0]);
            this.defaultAvatar = res.avatar[0].base64;
        });
    },

    methods: {
        // 获取后台数据
        getData() {
            const that = this;
            //axios的get请求,//使用spread方法处理响应数组结果
            this.$axios
                .get('/api/attendance/findAllAttendance')
                .then((res) => {
                    //console.log(res);
                    this.form = res.data;
                    //console.log('请求后台数据结果', this.form);
                    this.dataTraversal(this.form);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        // 获取全部课程数据
        getAllCourse() {
            const that = this;
            //axios的get请求,//使用spread方法处理响应数组结果
            this.$axios
                .get('/api/course/findAllCourse')
                .then((res) => {
                   // console.log(res);
                    that.QueryConditions = res.data;
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
                this.$set(this.list, 'weekDay', this.dataDateChange(form[i].weekDay));

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
            //console.log(this.newArray);
            this.tableData = this.newArray;
            this.query.currentPage = 1;
            this.query.pageTotal = form.length;
            this.query.pageSize = form.length;
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
        },
        //清除搜索框
        handleClear() {
            this.query.request = '';
            this.showOrNot = false;
            this.getData();
        },
        //监听事件-输入框
        inputFunc(e) {
            if (this.query.request == '') {
                this.showOrNot = false;
                this.getData();
            } else {
                this.showOrNot = true;
            }
            // this.inputData = { value }; //把数据存入inputData
            // console.log('检测到变化'+this.query.request);
        },
        inputFuncDay(value) {
            if (!value) return;
            let date = new Date(value);
            let weekIndex = date.getDay();
            this.QueryConditions.IsDay = weekArr[weekIndex];
        },
        // 触发搜索按钮
        handleSearch() {
            // console.log(this.query.request);//打印输入搜索的值
            this.tableData = [];
            const that = this;
            const findByID = '/api/scourse/findScourseBycourseID/';
            const findByName = '/api/scourse/findScourseByName/';
            //console.log(this.selected);
            if (this.query.request != '') {
                //
                if (this.selected == 0) {
                    this.requestAddr = findByID;
                    this.findStudentRequest(this.requestAddr);
                } else {
                    this.requestAddr = findByName;
                    this.findStudentRequest(this.requestAddr);
                }
            } else {
                this.$message.error(`请正确输入查询内容`);
                this.getData();
            }
        },
        findStudentRequest(val) {
            // this.$set(this.query, 'currentPage', 1);
            const that = this;
            this.tableData = [];
            this.$axios
                .get(val, { params: { id: this.query.request } })
                .then((res) => {
                    //console.log(res);
                    if (res.data[0] == null) {
                        this.$message.error(`无记录`);
                        that.query.currentPage = 0;
                        that.query.pageTotal = res.data.length;
                        that.query.pageSize = res.data.length;
                    } else {
                        this.list = [];
                        this.newArray = [];
                        for (const i in res.data) {
                            for (const key in res.data[i].course) {
                                //console.log("属性:"+key);
                                this.$set(this.list, key, res.data[i].course[key]); //对象新增属性(使用Vue.$set())
                                this.newArray[i] = this.list; //新建数组存放
                                // this.list.push(i + ':' + JSON.stringify(res.data[k].course[i]));
                            }
                            for (const key in res.data[i].student) {
                                //console.log("属性:"+key);
                                this.$set(this.list, key, res.data[i].student[key]); //对象新增属性(使用Vue.$set())
                                this.newArray[i] = this.list; //新建数组存放
                                // this.list.push(i + ':' + JSON.stringify(res.data[k].course[i]));
                            }
                            for (const key in res.data[i].teacher) {
                                //console.log("属性:"+key);
                                this.$set(this.list, key, res.data[i].teacher[key]); //对象新增属性(使用Vue.$set())
                                this.newArray[i] = this.list; //新建数组存放
                                // this.list.push(i + ':' + JSON.stringify(res.data[k].course[i]));
                            }
                            this.list = []; //循环完必须清空,否则可能会覆盖
                        }
                        this.tableData = this.newArray;
                        this.query.currentPage = 1;
                        this.query.pageTotal = res.data.length;
                        this.query.pageSize = res.data.length;
                    }
                })
                .catch((err) => {
                    console.log(err);
                    if (err.response.status === 400) {
                        this.$message.error(`请求错误！请正确输入查询内容`);
                    }
                });
        },
        // 保存编辑
        saveEdit() {
            const that = this;
            this.editVisible = false;
            this.$set(this.tableData, this.idx, this.form);
            console.log(this.tableData[this.idx]);

            this.$axios
                .post('/api/student/updateOne', this.tableData[this.idx])
                .then((res) => {
                    console.log(res);
                    that.$message.success(`修改第 ${this.idx + 1} 行成功`);
                    // if (res && res.status === 200) {
                    //     this.loadLogInfo();
                    // }
                })
                .catch((err) => {
                    console.error();
                    that.$message.error(`修改失败`);

                    // message:“请添加记录”,
                    // type:‘warning’
                    // })
                    // type 取值 ‘success’ /warning/info/error/;
                });
            // .catch((err) => {
            //     console.log(err);
            // });
        },
        // 保存编辑
        saveAdd() {
            const that = this;
            this.addisible = false;
            // this.$set(this.tableData, this.idx, this.form);
            this.formAdd.studentAvatar = this.defaultAvatar;
            if (this.formAdd.studentName && this.formAdd.studentPassword && this.formAdd.studentNumber != null) {
                console.log(this.formAdd);
                this.$axios
                    .post('/api/student/add', this.formAdd)
                    .then((res) => {
                        console.log(res);
                        if (res.status === 200) {
                            that.$message.success(`添加成功！`);
                            this.formAdd = {};
                            this.addVisible = false;
                        }

                        // if (res && res.status === 200) {
                        //     this.loadLogInfo();
                        // }
                    })
                    .catch((err) => {
                        console.error();
                        that.$message.error(`添加失败，账号已存在，请重新添加!`);
                    });
            } else {
                that.$message.error(`必填项未填`);
            }
        },

        // 删除操作
        handleDelete(index, row) {
            const that = this;
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    // this.$message.success('删除成功');
                    // this.tableData.splice(index, 1);
                    const id = this.tableData.splice(index, 1)[0].studentNumber;
                    console.log(id);
                    this.$axios
                        .post('/api/student/deleteOne/' + id)
                        .then((res) => {
                            console.log(res);
                            that.$message.success('删除成功');
                        })
                        .catch((err) => {
                            console.error();
                            that.$message.success(`删除失败`);
                        });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const that = this;
            const length = this.multipleSelection.length;
            let str = '';
            if (length == 0) {
                this.$message.error(`请选择删除的对象`);
            } else {
                this.delList = this.delList.concat(this.multipleSelection);
                console.log(this.delList);

                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].studentNumber + ',';
                }
                this.$confirm('此操作将批量删除日志信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        console.log(str);
                        this.$axios.post('/api/student/deleteMore', { studentNumber: str }).then((res) => {
                            if (res && res.status === 200) {
                                console.log(res.data); // 服务器回包内容
                                that.$message.error(`删除了${str}`);
                            }
                        });
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
            }
        },
        startDownload() {
            let self = this;
            if (self.multipleSelection.length == 0) {
                self.$message({
                    message: '警告，请勾选数据',
                    type: 'warning'
                });
            }
        },
        finishDownload() {
            let self = this;
            self.$message({
                message: '恭喜，数据导出成功',
                type: 'success'
            });
        },

        handleAllUpload() {
            const that = this;
            //axios的get请求,//使用spread方法处理响应数组结果
            this.$axios
                .get('/api/student/findAllStudent')
                .then((res) => {
                    //console.log(res);
                    that.tableData = res.data;
                    that.query.currentPage = 1;
                    that.query.pageTotal = res.data.length;
                    that.query.pageSize = res.data.length;
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        handleAdd() {
            this.$router.push('/addCourse');
        },

        handleUpload() {},

        // 分页导航
        handlePageChange(val) {
            //console.log(val);
            this.$set(this.query, 'currentPage', val);
            this.getData();
        }
    }
};
</script>

<style scoped>
.handleUpload {
    position: relative;
    margin-left: 950px;
    margin-top: -32px;
}
.handle-box {
    margin-bottom: 20px;
}
.handle-weekday {
    position: relative;
    margin-left: 570px;
    margin-top: -32px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 120px;
    display: inline-block;
}
/* .close {
    margin: 0 0 0 -30px;
} */

.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.blue {
    color: #2f00ff;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
    cursor: pointer;
}

.table-td-thumb.el-icon-circle-close {
    color: white;
}
.handle-add {
    color: rgb(6, 49, 240);
}
</style>
