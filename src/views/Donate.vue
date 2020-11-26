<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-redpacket_fill"></i> js调用摄像头拍照上传图片
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div align="center">
                <p id="flag" class="tishi"></p>
            </div>

            <!-- <div class="getface">
                <img id="imgTag" src alt="imgTag" style="display: none;" />
            </div>-->
            <el-button type="primary" icon="el-icon-camera-solid" @click="openCamera">点击考勤</el-button>
            <!-- <el-button type="primary" icon="el-icon-camera-solid" @click="closeCamera">关闭</el-button> -->

            <div>
                <!--开启摄像头-->
                <!-- <img @click="openCamera" :src="headImgSrc" alt="摄像头" /> -->
                <video ref="video" width="480px" height="400px" autoplay="autoplay"></video>
                <!-- <video id="video" preload autoplay loop muted></video> -->
                <!--canvas截取流-->
                <!-- <canvas ref="canvas" width="480px" height="400px" style="display: none;"></canvas> -->
                <canvas
                    ref="canvas"
                    id="canvas"
                    width="500"
                    height="500"
                    style="position:absolute;top:0;left:0;"
                ></canvas>

                <!-- <div class="getface">
                    <img id="imgTag" src alt="imgTag" style="display: none;" />
                </div> -->
                <!--图片展示-->
                <!--确认-->
                <!-- <el-button size="mini" type="primary" @click="photograph"></el-button> -->
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
            first: null
        };
    },
    created() {
        setTimeout(() => {
            this.openCamera(); // 此为绘画canvas的方法调用
        }, 2);
    },
    mounted() {},
    methods: {
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
            set_clear = setTimeout(function () {
                // 每秒 检测人脸 结果
                tracker.on('track', function (event) {
                    // 视频流
                    // context.clearRect(0, 0, canvas.width, canvas.height);
                    if (!that.first) {
                        // if  --- > else  检测到人脸 success() =>{}
                        event.data.forEach(function (rect) {
                            if (rect.x) {
                                that.first = rect.x;
                                video.pause(); // success  将暂停 video
                                console.log(rect);
                                console.log(video);
                                context.drawImage(video, 0, 0, 500, 500); // 绘制到 canvas
                                context.font = '11px Helvetica';
                                context.fillText('', 100, 40);
                                context.strokeStyle = '#a64ceb';
                                context.strokeRect(rect.x, rect.y, rect.width, rect.height);
                                var data_url = canvas.toDataURL('image/png'); //base64 request
                               // console.log(data_url);

                               setTimeout(() => {
                                    //设置延迟执行
                                     video.load();
                                   console.log("---------------------"+data_url);
                                }, 5000);
                                //video.load();
                                that.first = null;
                                that.tracker_fun(tracker, video, context, canvas);
                                return;
                            }
                        });
                    }
                });
                clearTimeout(set_clear);
                console.log('-------');
            }, 5000);
        }
    },
    mounted() {},
    destroyed() {
        // 停止侦测
        this.trackerTask.stop();
        // 关闭摄像头
        window.tracking.closeCamera();
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
</style>