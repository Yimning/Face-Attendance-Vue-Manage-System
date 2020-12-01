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
            <el-button type="primary" icon="el-icon-camera-solid" @click="openCamera">打开摄像头</el-button>
            <el-button type="primary" icon="el-icon-camera-solid" @click="closeCamera">关闭摄像头</el-button>

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

export default {
    name: 'componentName',
    data() {
        return {
            videoEle: null,
            trackerTask: null,
            first: null,
            faceInfo: {
                imgpath: '',
                courseID:'',
                UserID:'',
            },
            dataParams: {},
        };
    },  
    created() {
        this.dataParams=this.$route.query.data; 
        this.faceInfo.courseID=this.dataParams.courseID;
        console.log( this.faceInfo);
    },
    methods: {
        created() {
            setTimeout(() => {
                this.openCamera(); // 此为绘画canvas的方法调用
            }, 2);
        },
        mounted() {},
        openCamera() {
            var video = document.getElementById('video');
            var canvas = document.getElementById('canvas');
            var context = this.$refs['canvas'].getContext('2d');
            var tracker = new tracking.ObjectTracker('face'); // 引入第三方库  cnpm install tracking --save
            tracker.setInitialScale(1);
            tracker.setStepSize(2);
            tracker.setEdgesDensity(0.1);

            this.trackerTask = tracking.track('#video', tracker, { camera: true });
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
            let that = this;
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
                                    // const jwt = res.headers['authorization'];
                                    // const userInfo = res.data;

                                    // // 把数据共享出去，存于this.store下
                                    // that.$store.commit('SET_TOKEN', jwt);
                                    // that.$store.commit('SET_USERINFO', userInfo);
                                    //console.log(userInfo)
                                    if (res.data.error_code === 0 && res.data.face_liveness > 0.8) {
                                        that.closeCamera();
                                        // 登录成功跳转到首页
                                       // that.$router.push('/dashboard');
                                        that.$message.success('登录成功');
                                        that.FaceLoginVisible = false;
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
            }, 3000);
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
        }
    }
    // mounted() {},
    // destroyed() {
    //     // 停止侦测
    //     this.trackerTask.stop();
    //     // 关闭摄像头
    //     window.tracking.closeCamera();

    // }
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
</style>