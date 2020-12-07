<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-redpacket_fill"></i> 课程考勤 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!-- <div class="getface">
                <img id="imgTag" src alt="imgTag" style="display: none;" />
            </div>-->
            <el-button type="primary" icon="el-icon-camera-solid" @click="openCamera" v-bind:disabled="openIsCheck">打开摄像头</el-button>
            <el-button type="danger" icon="el-icon-camera-solid" @click="closeCamera" v-bind:disabled="!openIsCheck">关闭摄像头</el-button>
            <!-- <el-button type="primary" icon="el-icon-camera-solid" @click="countDown">倒计时</el-button> -->
            <el-select
                v-model="selected"
                v-bind:disabled="openIsCheck"
                placeholder="倒计时"
                v-on:input="selectedFunc"
                class="handle-select mr10"
            >
                <el-option key="20分钟" label="倒计时20分钟" value="20"></el-option>
                <el-option key="15分钟" label="倒计时15分钟" value="15"></el-option>
                <el-option key="12分钟" label="倒计时12分钟" value="12"></el-option>
                <el-option key="1分钟" label="倒计时1分钟" value="1"></el-option>
                <el-option key="10秒" label="倒计时10秒" value="10"></el-option>
            </el-select>

            <el-button class="time">00:{{ minute }}:{{ second }}</el-button>
            <!--提示-->
            <div align="center">
                <p id="flag" class="tishi"></p>
            </div>

            <div align="center">
                <!--开启摄像头-->
                <video id="video" ref="video" width="480px" height="400px" autoplay="autoplay"></video>
                <!-- <video id="video" preload autoplay loop muted></video> -->
                <!--canvas截取流-->
                <canvas ref="canvas" id="canvas" width="480px" height="400px" style="display: none"></canvas>
            </div>
        </div>
    </div>
</template>
  
<script>
require('tracking/build/tracking-min.js');
require('tracking/build/data/face-min.js');
require('tracking/build/data/mouth-min.js');
require('tracking/examples/assets/stats.min.js');
import { sendWebSocket, closeWebSocket } from '@/utils/websocket.js';
export default {
    name: 'componentName',
    inject: ['reload'],
    data() {
        return {
            videoEle: null,
            trackerTask: null,
            first: null,
            faceInfo: {
                imgpath: '',
                courseID: '',
                UserID: ''
            },
            selected: '15',
            openIsCheck: false,
            dataParams: {},
            dataJson: {},
            params: {},
            timeSeconds: 0,
            timeMinutes: 0,
            seconds: 0, // 秒
            minutes: 15, // 分
            timer: null,
            tempTime: ''
        };
    },
    created() {
        this.dataParams = this.$route.query.data;
        // this.faceInfo.courseID = this.dataParams.courseID;
        // console.log(this.faceInfo);
        //sessionStorage.setItem('courseID', this.dataParams.courseID);
        this.faceInfo.courseID = sessionStorage.getItem('courseID');
        console.log(this.faceInfo);
        this.tempTime = 15;
    },
    mounted() {
        // this.add();
    },

    methods: {
        created() {
            setTimeout(() => {
                this.openCamera(); // 此为绘画canvas的方法调用
            }, 2);
        },
        mounted() {},
        openCamera() {
            let that = this;
            if (this.faceInfo.courseID == '' || this.faceInfo.courseID == 'undefined') {
                this.$message.error('记录号失效,2秒后返回前一页');
                return setTimeout(() => {
                    //设置延迟执行
                    that.$router.go(-1);
                }, 2000);
            }
            var video = document.getElementById('video');
            var canvas = document.getElementById('canvas');
            var context = this.$refs['canvas'].getContext('2d');
            var tracker = new tracking.ObjectTracker('face'); // 引入第三方库  cnpm install tracking --save
            tracker.setInitialScale(1);
            tracker.setStepSize(2);
            tracker.setEdgesDensity(0.1);
            this.trackerTask = tracking.track('#video', tracker, { camera: true });
            this.countDown();
            this.openIsCheck = true;
            this.requstWs();
            //-------  指定 canvas 的宽高 ，auto 自动播放
            let constraints = {
                video: { width: 500, height: 500 },
                audio: true
            };

            let promise = navigator.mediaDevices.getUserMedia(constraints); // h5 新的API

            promise
                .then(function (MediaStream) {
                    video.srcObject = MediaStream;
                    video.play();
                })
                .catch(function (PermissionDeniedError) {
                    console.log(PermissionDeniedError);
                });
            //--------------
            that.tracker_fun(tracker, video, context, canvas); //open 摄像头，执行tracker_fun( 传入参数 )
        },
        tracker_fun(tracker, video, context, canvas) {
            let that = this;
            let set_clear;
            let flag = true;
            set_clear = setTimeout(function () {
                // 每秒 检测人脸 结果
                tracker.on('track', function (event) {
                    that.tips = '正在刷脸中';
                    // 视频流
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    event.data.forEach(function (rect) {
                        context.strokeStyle = '#ff0000';
                        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
                    });
                    if (event.data.length) {
                        // 会不停的去检测人脸，所以这里需要做个锁
                        if (flag) {
                            // 裁剪出人脸并绘制下来
                            const canvasUpload = document.getElementById('canvas');
                            const contextUpload = canvasUpload.getContext('2d');
                            contextUpload.drawImage(video, 0, 0, 480, 400);
                            flag = false;
                            // 人脸的basa64
                            that.faceInfo.imgpath = canvasUpload.toDataURL('image/jpeg');
                            // console.log(that.face);

                            // ajax请求
                            that.$axios
                                .post('/api/attendance/faceAttendance', JSON.stringify(that.faceInfo), {
                                    headers: {
                                        'Content-Type': 'application/json; charset=UTF-8'
                                    }
                                })
                                .then((res) => {
                                    console.log(res);
                                    if (res.data.error_code === 0 && res.data.face_liveness > 0.8) {
                                        if (res.data.result === 0) return that.$message.error('Fail');
                                        if (res.data.result === 1) return that.$message.error('Success');
                                        if (res.data.result === 2) return that.$message.error('Exist');
                                        if (res.data.result === 3) return that.$message.error('NONE');
                                    } else {
                                        // 登录失败重新进行人脸检测
                                        // continue;
                                        //that.$message.fail('记录风险');
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                            setTimeout(() => {
                                //设置延迟执行
                                video.load();
                                that.first = null;
                                that.tracker_fun(tracker, video, context, canvas);
                            }, 2000);
                        }
                    } else {
                        that.tips = '没有检测到人脸';
                    }
                });
                clearTimeout(set_clear);
                this.tips = '重新加载摄像头';
            }, 2000);
        },
        // 关闭摄像头
        closeCamera() {
            if (!this.$refs['video'].srcObject) return;
            let stream = this.$refs['video'].srcObject;
            let tracks = stream.getTracks();
            tracks.forEach((track) => {
                track.stop();
            });
            this.$refs['video'].srcObject = null;
            this.openIsCheck = false;
            // this.reload(); //刷新 ----推荐
            var that = this;
            //倒计时复位

            that.seconds = 0;
            that.minutes = 0;
            clearInterval(that.timer);
            this.closeWebSocket();
            this.selectedFunc(this.tempTime);
        },
        selectedFunc(e) {
            //console.log(e);
            this.minutes = e;
            if (e == '10') {
                //console.log(e);  //测试用
                this.minutes = 0;
                this.seconds = e;
            } else {
                this.minutes = e;
            }
            //记录当前的值
            this.tempTime = e;
        },
        num(n) {
            return n < 10 ? '0' + n : '' + n;
        },
        countDown() {
            this.add();
        },
        add() {
            var that = this;
            this.timer = window.setInterval(function () {
                if (that.seconds === 0 && that.minutes !== 0) {
                    that.seconds = 59;
                    that.minutes -= 1;
                } else if (that.minutes === 0 && that.seconds === 0) {
                    that.seconds = 0;
                    window.clearInterval(that.timer);
                    console.log('时间到');
                    // that.checkNoFlag();
                    that.closeCamera();
                } else {
                    that.seconds -= 1;
                }
            }, 1000);
        },
        //查询在考勤结束之后搜索改课程的选课学生,未考勤的学生并把信息加入数据库,若已考勤则原纪录信息不变
        checkNoFlag() {
            const url = '/api/scourse/findScourseByteacherNumbercIDcD';
            this.params = {
                params: {
                    cID: this.faceInfo.courseID,
                    studentNumber: null,
                    studentName: null,
                    tID: this.$store.getters.getUser.userID,
                    teacherName: null,
                    flag: null,
                    time: null
                }
            };
            this.requestHandle(url, this.params);
        },
        requestHandle(url, params) {
            const that = this;
            //axios的get请求
            this.$axios
                .get(url, params)
                .then((res) => {
                    console.log(res);
                    that.dataJson = res.data;
                    that.queryHandle(null, that.dataJson);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        //考勤结束之后，查询未签到的学生信息自动录入数据库
        queryHandle(url, params) {
            url = '/api/attendance/addNotAttendance';
            //console.log(JSON.stringify(params));
            this.$axios
                .post(url, JSON.stringify(params))
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        // ws连接成功，后台返回的ws数据，组件要拿数据渲染页面等操作
        wsMessage(data) {
            const dataJson = data;
            console.log(dataJson);
            // 这里写拿到数据后的业务代码
        },
        // ws连接失败，组件要执行的代码
        wsError() {
            // 比如取消页面的loading
        },
        requstWs() {
            const url = '/api//webSocket/serialPorts';
            const params = {
                params: {
                    shipId: "allTeacher",
                    message: this.$store.getters.getUser.userID
                }
            };
            this.$axios
                .get(url,params)
                .then((res) => {
                    console.log("web"+res);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        closeWebSocket() {
            closeWebSocket();
        }
    },
    watch: {
        second: {
            handler(newVal) {
                this.num(newVal);
            }
        },
        minute: {
            handler(newVal) {
                this.num(newVal);
            }
        }
    },
    computed: {
        second: function () {
            return this.num(this.seconds);
        },
        minute: function () {
            return this.num(this.minutes);
        }
    },
    destroyed() {
        // 退出后清除计时器
        if (this.timer) {
            clearInterval(this.timer);
        }
        closeWebSocket();
    }
};
</script>

<style>
.getface {
    position: absolute;
    top: 20%;
    left: 35%;
    box-shadow: 0 0px 12px 0 rgba(0, 0, 0, 0.1);
}
.tishi {
    font-size: 20px;
}
.handle-select {
    width: 130px;
}
.mr10 {
    margin-left: 15px;
    margin-bottom: 0px;
    margin-top: 0px;
    margin-right: 10px;
}
.time {
    margin-left: 500px;
    margin-top: -10px;
    color: #f72a3a;
    font-weight: bold;
    font-size: 24px;
}
</style>