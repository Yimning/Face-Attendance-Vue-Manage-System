<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 全部教师信息 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>

                <el-select v-model="selected" placeholder="查询条件" class="handle-select mr10">
                    <el-option key="查教师号" label="教师号" value="0"></el-option>
                    <el-option key="查姓名" label="姓名" value="1"></el-option>
                </el-select>

                <el-input
                    v-model="query.request"
                    v-if="selected === '0'"
                    placeholder="输入教师号"
                    class="handle-input mr10"
                    @keyup.enter.native="handleSearch"
                    id="messageInput"
                    v-on:input="inputFunc"
                ></el-input>
                <!-- @keyup.enter 但是若在组件框架中写需要加.native -->
                <el-input
                    v-model="query.request"
                    v-else
                    placeholder="输入姓名"
                    class="handle-input mr10"
                    @keyup.enter.native="handleSearch"
                    id="messageInput"
                    v-on:input="inputFunc"
                ></el-input>

                <el-button v-if="showOrNot" type="warning" icon="el-icon-close" @click="handleClear">清除</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="success" icon="el-icon-circle-plus" @click="handleAdd">添加教师信息</el-button>
                <download-excel
                    class="handleUpload"
                    :fields="json_fields"
                    :data="multipleSelection"
                    :before-generate="startDownload"
                    :before-finish="finishDownload"
                    type="xls"
                >
                    <el-button type="info" icon="el-icon-download">导出</el-button>
                    <el-button type="info" icon="el-icon-download" @click="handleAllUpload">全部导出</el-button>
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
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column prop="teacherNumber" label="教师号" align="center"></el-table-column>
                <el-table-column prop="teacherName" label="姓名" align="center"></el-table-column>
                <el-table-column prop="teacherSex" label="性别" align="center">
                    <!-- 打印￥的模板 -->
                    <!-- <template slot-scope="scope">￥{{scope.row.money}}</template> -->
                </el-table-column>
                <el-table-column prop="courseID" label="授课课程号" align="center"></el-table-column>

                <!-- <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.state==='成功'?'success':(scope.row.state==='失败'?'danger':'')"
                        >{{scope.row.state}}</el-tag>
                    </template>
                </el-table-column>-->

                <el-table-column label="头像(查看大图)" align="center">
                    <!-- scope.row  当前行的数据对象 -->
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.teacherAvatar"
                            :preview-src-list="[scope.row.teacherAvatar]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-more" class="blue" @click="handleMore(scope.$index, scope.row)"
                            >详情</el-button
                        >
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
                <el-form-item label="教师号">
                    <el-input v-model="form.teacherNumber" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.teacherName" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-input v-model="form.teacherSex" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="所授课程号">
                    <el-input v-model="form.profession" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="加入时间">
                    <el-input v-model="form.joinTime" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <el-input v-model="form.teacherAvatar" readonly="readonly"></el-input>
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
                <el-form-item label="教师号">
                    <el-input v-model="form.teacherNumber" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.teacherName"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="ifCod">
                    <!-- <el-input v-model="formAdd.studentSex"></el-input> -->
                    <el-radio v-model="form.teacherSex" label="男">男</el-radio>
                    <el-radio v-model="form.teacherSex" label="女">女</el-radio>
                </el-form-item>
                <el-form-item label="所授课程">
                    <el-input v-model="form.courseID"></el-input>
                </el-form-item>
                <el-form-item label="加入时间">
                    <div class="block">
                        <span class="demonstration"></span>
                        <el-date-picker v-model="form.joinTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="头像">
                    <el-input v-model="form.teacherAvatar" readonly="readonly"></el-input>
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
                <el-form-item label="教师号">
                    <el-input v-model="formAdd.teacherNumber"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="formAdd.teacherName" placeholder="必填项"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <!-- <el-input v-model="formAdd.studentSex"></el-input> -->
                    <el-radio v-model="formAdd.teacherSex" label="男">男</el-radio>
                    <el-radio v-model="formAdd.teacherSex" label="女">女</el-radio>
                </el-form-item>
                <el-form-item label="所授课程">
                    <el-input v-model="formAdd.courseID"></el-input>
                </el-form-item>
                <el-form-item label="加入时间">
                    <div class="block">
                        <span class="demonstration"></span>
                        <el-date-picker v-model="formAdd.joinTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="初始密码">
                    <el-input v-model="formAdd.teacherPassword" placeholder="必填项"></el-input>
                </el-form-item>
                <el-form-item label="默认头像">
                    <el-input v-model="form.teacherAvatar" readonly="readonly" placeholder="后台会选择默认头像,此项无需操作"></el-input>
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
            requestAddr: '',
            selected: '0', //注意数据格式的转换，否则会导致不正常
            tableData: [],
            multipleSelection: [],
            json_fields: {
                教师号: 'teacherNumber',
                姓名: 'teacherName',
                性别: 'teacherSex',
                所授课程: 'courseID'
            },
            delList: [],
            editVisible: false,
            moreVisible: false,
            addVisible: false,
            showOrNot: false,
            form: {},
            formAdd: {},
            defaultAvatar: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData(); //渲染
        AvatarData(this.defaultAvatar).then((res) => {
            // console.log(res.avatar[0]);
            this.defaultAvatar = res.avatar[0].base64;
        });
    },
    components: {
        'download-excel': JsonExcel
    },

    methods: {
        // 获取后台数据
        getData() {
            const that = this;
            //axios的get请求,//使用spread方法处理响应数组结果
            this.$axios
                .get('/api/teacher/page?currentPage=' + this.query.currentPage)
                .then((res) => {
                    //  console.log(res);
                    this.tableData = res.data.data.records;
                    this.query.currentPage = res.data.data.current;
                    this.query.pageTotal = res.data.data.total;
                    this.query.pageSize = res.data.data.size;
                    // console.log('请求后台数据结果', res.data.data);
                })
                .catch((err) => {
                    console.log(err);
                });
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
        // 触发搜索按钮
        handleSearch() {
            // console.log(this.query.request);//打印输入搜索的值
            this.tableData = [];
            const that = this;
            const findByID = '/api/teacher/findTeacherByID/';
            const findByName = '/api/teacher/findTeacherByName/';
            console.log(this.selected);
            if (this.query.request != '') {
                //
                if (this.selected == 0) {
                    this.requestAddr = findByID;
                    this.findTeacherRequest(this.requestAddr);
                } else {
                    this.requestAddr = findByName;
                    this.findTeacherRequest(this.requestAddr);
                }
            } else {
                this.$message.error(`请正确输入查询内容`);
                this.getData();
            }
        },
        findTeacherRequest(val) {
            // this.$set(this.query, 'currentPage', 1);
            const that = this;
            this.tableData = [];
            this.$axios
                .get(val + this.query.request)
                .then((res) => {
                    //console.log(res);
                    if (res.data[0] == null) {
                        this.$message.error(`无记录`);
                        that.query.currentPage = 0;
                        that.query.pageTotal = res.data.length;
                        that.query.pageSize = res.data.length;
                    } else {
                        that.tableData = res.data;
                        that.query.currentPage = 1;
                        that.query.pageTotal = res.data.length;
                        that.query.pageSize = res.data.length;
                        // console.log('请求后台数据结果', res.data);
                    }
                })
                .catch((err) => {
                    //console.log(err);
                    if (err.response.status === 400) {
                        this.$message.error(`请求错误！请正确输入查询内容`);
                    }
                });
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
                    const id = this.tableData.splice(index, 1)[0].teacherNumber;
                    console.log(id);
                    this.$axios
                        .post('/api/teacher/deleteOne/' + id)
                        .then((res) => {
                            //console.log(res);
                            that.$message.success('删除成功');
                        })
                        .catch((err) => {
                            //console.error();
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
                    str += this.multipleSelection[i].teacherNumber + ',';
                }
                this.$confirm('此操作将批量删除日志信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        //console.log(str);  //是显示删除的账号
                        this.$axios.post('/api/teacher/deleteMore', { teacherNumber: str }).then((res) => {
                            if (res && res.status === 200) {
                                // console.log(res.data); // 服务器回包内容
                                if (res.data == 'success') {
                                    that.$message.success(`删除了${str}`);
                                } else {
                                    that.$message.error(`删除失败`);
                                }
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

        handleAdd() {
            this.addVisible = true;
        },
        //详情信息
        handleMore(index, row) {
            this.idx = index;
            this.form = row;
            this.moreVisible = true;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            if (this.form.teacherSex == '男') {
                this.form.teacherSex = '男';
            } else this.form.teacherSex = '女';
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            const that = this;
            this.editVisible = false;
            this.$set(this.tableData, this.idx, this.form);
            console.log(this.tableData[this.idx]);

            this.$axios
                .post('/api/teacher/updateOne', this.tableData[this.idx])
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
            this.formAdd.teacherAvatar = this.defaultAvatar;
            if (this.formAdd.teacherName && this.formAdd.teacherPassword && this.formAdd.teacherNumber != null) {
                // console.log(this.formAdd);
                this.$axios
                    .post('/api/teacher/add', this.formAdd)
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

        handleAllUpload() {
            const that = this;
            //axios的get请求,//使用spread方法处理响应数组结果
            this.$axios
                .get('/api/teacher/findAllTeacher')
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

        // 分页导航
        handlePageChange(val) {
            console.log(val);
            this.$set(this.query, 'currentPage', val);
            this.getData();
        }
    }
};
</script>

<style scoped>
.handleUpload {
    position: relative;
    margin-left: 700px;
    margin-top: -32px;
}
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 200px;
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
