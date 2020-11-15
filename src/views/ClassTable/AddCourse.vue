<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 课程管理 </el-breadcrumb-item>
                <el-breadcrumb-item>添加课程</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" :rules="rules" label-width="280px" class="box-content">
                    <el-form-item label="课程号:" prop="id">
                        <el-input placeholder="请输入课程号" v-model="form.question"> </el-input>
                    </el-form-item>

                    <el-form-item label="课程名称:" prop="name">
                        <el-input placeholder="请输入课程名称" v-model="form.courseName" clearable> </el-input>
                    </el-form-item>

                    <el-form-item label="每周:" prop="week">
                        <el-select v-model="form.region" placeholder="请选择">
                            <el-option
                                el-option
                                v-for="item in weekOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="上课时间:" prop="time">
                        <el-time-select
                            :span="11"
                            v-model="form.courseTime"
                            :picker-options="{
                                start: '08:00',
                                step: '00:05',
                                end: '21:05'
                            }"
                            placeholder="选择时间"
                        >
                        </el-time-select>
                    </el-form-item>
                    <el-form-item label="上课地点:" prop="place">
                        <el-cascader :options="form.classRoomID" v-model="form.classRoomID"></el-cascader>
                    </el-form-item>
                    <el-form-item label="起始节:" prop="perid" class="perid">
                        <el-input-number v-model="num1" @change="handleChange1" :min="1" :max="12"></el-input-number>
                        <el-input-number class="perid-right" v-model="num2" @change="handleChange2" :min="1" :max="12"></el-input-number>
                        <el-col class="line" :span="4">-</el-col>
                    </el-form-item>
                    <el-form-item label="起始周:" prop="weeks" class="perid">
                        <el-input-number v-model="num3" @change="handleChange3" :min="1" :max="25"></el-input-number>
                        <el-input-number class="perid-right" v-model="num4" @change="handleChange4" :min="1" :max="25"></el-input-number>
                        <el-col class="line" :span="4">-</el-col>
                    </el-form-item>
                    <el-form-item label="课程说明:">
                        <el-input placeholder="选填" v-model="form.question"> </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('form')">确认修改</el-button>
                        <el-button type="danger" plain @click="onCancel('form')">取消</el-button>
                    </el-form-item>
                </el-form>

                <el-dialog
                    title="提示"
                    :visible.sync="Successdialog"
                    :show-close="false"
                    :close-on-click-modal="true"
                    :close-on-press-escape="false"
                    width="30%"
                    center
                >
                    <span style="font-size: 18px">修改密码成功！{{ Sencond }}秒后关闭页面,重新登录。</span>
                    <span slot="footer" class="dialog-footer">
                        <!-- //footer这里我只保留了一个按键，大家自由发挥 -->
                        <el-button @click="sendMsg" type="primary" :disabled="isDisabled">立即关闭</el-button>
                    </span>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseform',
    data() {
        return {
            weekOptions: [
                { value: '1', label: '星期一' },
                { value: '2', label: '星期二' },
                { value: '3', label: '星期三' },
                { value: '4', label: '星期四' },
                { value: '5', label: '星期五' },
                { value: '6', label: '星期六' },
                { value: '7', label: '星期天' }
            ],
            num1: 1,
            num2: 1,
            num3: 1,
            num4: 1,
            form: {
                options: []
            },
            findUserUrl: '',
            updateOneUrl: '',
            rules: {
                pwdAnswer: [{ required: true, message: '请输入密保答案', trigger: 'blur' }],
                pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                pwdNew: [{ required: true, message: '再次输入密码', trigger: 'blur' }]
            },
            Successdialog: false, //控制弹出
            Sencond: 5, //设置初始倒计时
            isDisabled: false
        };
    },
    //  或者使用做个地址请求 '/api/student/findStudentByID?id=1'
    created() {
        this.findUserUrl = '/api/classroom/findAllClassroom';
        this.$axios
            .get(this.findUserUrl, { params: { id: this.$store.getters.getUser.userID } })
            .then((res) => {
                console.log(res.data);
                this.form = res.data[res.data.length - 1];
                this.form.rightAnswer = res.data[res.data.length - 1].answer;
            })
            .catch((err) => {
                console.log(err);
            });
    },
    methods: {
        onSubmit() {
            const that = this;
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (this.form.pwd == this.form.pwdNew) {
                        if (this.form.rightAnswer == this.form.pwdAnswer) {
                            this.form.studentPassword = this.form.pwdNew;
                            this.form.teacherPassword = this.form.pwdNew;
                            this.form.adminPassword = this.form.pwdNew;
                            this.$confirm('确定修改?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'info'
                            })
                                .then(() => {
                                    that.$axios
                                        .post(that.updateOneUrl, that.form)
                                        .then((res) => {
                                            // console.log(res);
                                            that.getSencond();
                                        })
                                        .catch((err) => {
                                            console.error();
                                            that.$message.error(`修改失败`);
                                        });
                                })
                                .catch(() => {});
                        } else {
                            this.$message.error('密保答案错误，请正确输入！');
                        }
                    } else {
                        this.$message.error('两次密码输入不一致');
                        this.form.pwdNew = '';
                        this.form.pwd = '';
                    }
                }
            });
        },
        onCancel() {
            this.form.pwdAnswer = '';
            this.form.pwdNew = '';
            this.form.pwd = '';
        },
        handleChange1(value) {
            this.num2 = this.num1 + 1;
            console.log(value);
        },
        handleChange2(value) {
            // console.log(value);
        },
        handleChange3(value) {
            this.num4 = this.num3 + 1;
        },
        handleChange4(value) {},
        getSencond() {
            const that = this;
            that.Successdialog = true;
            const interval = window.setInterval(function () {
                --that.Sencond;
                if (that.Sencond === 0) {
                    that.isDisabled = false;
                    that.Successdialog = false;
                    window.clearInterval(interval);
                    that.sendMsg(); //倒计时结束时运行的业务逻辑，这里的是关闭当前页面
                }
            }, 1000);
        },
        sendMsg() {
            //window.close();
            //删除session缓存信息
            this.$store.commit('REMOVE_INFO');
            this.$router.push('/login');
        }
    }
};
</script>

</script>
 
<style scoped>
.perid {
    position: relative;
}
.line {
    margin-left: 120px;
    margin-top: -30px;
    margin-right: 50px;
}
.perid-right {
    margin-left: 30px;
}
</style>