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
                            v-model="courseTime"
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
                        <el-cascader :options="options" v-model="form.classRoomID"></el-cascader>
                    </el-form-item>
                    <el-form-item label="起始节:" prop="perid" class="perid">
                        <el-input-number v-model="num" @change="handleChange" :min="1" :max="10"></el-input-number>
                        <el-input-number class="perid-right" v-model="num" @change="handleChange" :min="1" :max="10"></el-input-number>
                        <el-col class="line" :span="4">-</el-col>
                    </el-form-item>
                    <el-form-item label="起始周:" prop="weeks" class="perid">
                        <el-input-number v-model="num" @change="handleChange" :min="1" :max="10"></el-input-number>
                        <el-input-number class="perid-right" v-model="num" @change="handleChange" :min="1" :max="10"></el-input-number>
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
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: true,
                type: ['步步高'],
                resource: '小天才',
                desc: '',
                options: []
            }
        };
    },
    methods: {
        onSubmit() {
            this.$message.success('提交成功！');
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