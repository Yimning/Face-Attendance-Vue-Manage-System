<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 当前课程 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column type="selection" width="40" align="center"></el-table-column>
                <el-table-column prop="courseID" label="课程号" align="center"></el-table-column>
                <el-table-column prop="courseName" label="课程名" align="center"></el-table-column>
                <el-table-column prop="teacherName" label="授课教师" align="center"></el-table-column>
                <el-table-column prop="courseDay" label="星期" align="center"></el-table-column>
                <el-table-column prop="courseTime" label="上课时间" align="center"></el-table-column>
                <el-table-column prop="weekDay" label="上课地点" align="center"></el-table-column>
                <el-table-column prop="coursePeriodF" label="起始节" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-more" class="blue" @click="handleMore(scope.$index, scope.row)"
                            >统计</el-button
                        >
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">出勤率</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { fetchData, AvatarData } from '../../api/index';
import JsonExcel from 'vue-json-excel';
const weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
export default {
    name: 'basetable',
    inject: ['reload'],
    data() {
        return {
            tableData: [],
            list: [{}],
            weeks: {
                0: '星期日',
                1: '星期一',
                2: '星期二',
                3: '星期三',
                4: '星期四',
                5: '星期五',
                6: '星期六'
            }
        };
    },
    components: {},
    created() {
                this.getData(); //渲染
    },

    methods: {
         // 获取后台数据
        getData() {
            const that = this;
            if (this.$store.getters.getUser.roseID == '1') {
                if (this.$store.getters.getUser.roseName == '教师管理员') {
                    const url = '/api/attendance/findAllAttendance';
                    this.$axios
                        .get(url)
                        .then((res) => {
                            //console.log(res);
                            this.form = res.data;
                            //console.log('请求后台数据结果', this.form);
                            this.dataTraversal(this.form);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    const params = { params: { id: this.$store.getters.getUser.userID } };
                    const that = this;
                    //axios的get请求
                    this.$axios
                        .get('/api/attendance/findAttendanceByteacherID', params)
                        .then((res) => {
                            //console.log(res);
                            this.form = res.data;
                            //console.log('请求后台数据结果', this.form);
                            this.dataTraversal(this.form);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            }
        },
    }
};
</script>

<style scoped>
.handleUpload {
    position: relative;
    margin-left: 850px;
    margin-top: -32px;
}
.handle-box {
    margin-bottom: 20px;
    display: block;
}
.handle-line {
    margin-top: 8px;
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
