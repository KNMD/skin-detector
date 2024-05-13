"use client"
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { RxSymbol } from "react-icons/rx";
import { Button } from "@/components/ui/button"

export default function FaceDetection() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null)
  const [tipsClose, setTipsClose] = useState(false)
  const [stream, setStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false); // 控制显示视频或canvas
  const [lines, setLines] = useState([{
    x: '100px',
    y: '100px',
    width: '2px',
  }]);
  const [texts, setTexts] = useState([]);
  const router = useRouter();
  useEffect(() => {

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          setStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(console.error);
    }
  }, []);

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const img = imgRef.current;
    if (canvas && video) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      let size = Math.min(canvas.width, canvas.height);
      let x = 0;
      let y = 0;

      if (canvas.width > canvas.height) {
        x = (canvas.width - size) / 2;
      } else {
        y = (canvas.height - size) / 2;
      }

      // 剪裁图像为正方形
      const imageData = context.getImageData(x, y, size, size);
      canvas.width = size;
      canvas.height = size;
      context.putImageData(imageData, 0, 0);

      // 停止视频流并切换到canvas
      stream.getTracks().forEach(track => track.stop());
      setIsCapturing(true);

      // 开始放大效果
      img.style.transform = "scale(1)";
      img.style.transition = "transform 3s ease";

      setTimeout(() => {
        img.style.transform = "scale(1.2)";
      }, 100); // 稍微延迟以确保动画生效



      // 上传图像
      canvas.toBlob(blob => {

        var videoURL = URL.createObjectURL(blob);
        // window.open(videoURL)
        img.src = videoURL
        const formData = new FormData();
        formData.append('file', blob, 'capture.png');
        console.log("post form data: ", formData, blob)
        api.postRaw("/api/skinDetect", formData).then(res => {
          console.log("skinDetect res: ", res)
          if (res.Data) {
            localStorage.setItem("detectResult", JSON.stringify(res.Data))
            router.push("/reports")
          }
        }).finally(() => {
          // setIsCapturing(false);
        })

        // fetch("/api/skinDetect", {
        //   method: 'POST',
        //   body: formData
        // }).then(res => {
        //   console.log("res:", res)
        // })

      }, 'image/png');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen relative w-full overflow-hidden">
      <video ref={videoRef} className={`w-full h-full object-cover ${isCapturing ? 'hidden' : ''}`} autoPlay playsInline content="width=device-width, initial-scale=1.0"></video>
      <div className="absolute border-4 border-white-100" style={{ width: '300px', height: '450px', margin: 'auto', top: 0, right: 0, bottom: 0, left: 0, 'borderRadius': '150px' }}></div>
      <img ref={imgRef} className={`w-full h-full object-cover ${isCapturing ? '' : 'hidden'}`} />
      <canvas ref={canvasRef} className={`w-full h-full object-cover hidden`} />
      {/* <button className="absolute bottom-10 px-4 py-2 bg-blue-500 text-white rounded-full" onClick={captureImage}>拍照</button> */}
      <Button className="absolute bottom-20 text-xl p-4 bg-blue-500 text-white rounded-full" onClick={captureImage} disabled={isCapturing ? true : false}>
        {isCapturing && <RxSymbol className="mr-2 h-4 w-4 animate-spin" />}
        拍照
      </Button>
      {
        !tipsClose && (
          <div className='w-full h-full absolute bg-slate-300 left-0 top-0'>
            <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 shadow-lg rounded-xl z-10 bg-white p-4 justify-center flex flex-col text-slate-400 text-xs'>
              <h2 class="text-xl text-stone-600">免责声明</h2>
              <p className='h-96 overflow-y-auto'>
                欢迎使用皮肤检测应用。在您使用本应用前，请仔细阅读以下免责声明。本声明旨在明确我们的责任范围、用户权利和义务，并提醒用户在使用本应用时注意相关事项。使用本应用即表示您同意本免责声明的全部内容。

                本应用采用人工智能技术和大数据分析方法，旨在为用户提供皮肤检测服务。我们的技术和算法是通过对大量数据的分析和训练而得出的，并且尽最大努力确保检测结果的准确性和可靠性。然而，由于个体差异、环境因素等原因，我们无法保证检测结果的绝对准确性和完全适用性。
                本应用提供的皮肤检测结果仅供参考，不应视为专业医疗建议。我们建议用户在接受任何治疗或采取行动之前，先咨询专业医疗人员的意见。对于任何由于依赖本应用的检测结果而导致的损失或损害，我们概不负责。
                用户在使用本应用时，应确保提供的信息准确、完整，并遵守适用的法律法规。我们不对用户提供的信息的准确性、完整性或合法性负责，也不承担因用户提供信息不准确、不完整或违法而导致的任何责任。
                本应用可能包含由第三方提供的链接、广告或内容，这些链接、广告或内容与我们无关。用户访问这些链接、查看这些广告或使用这些内容时，应自行承担风险，并遵守该第三方的相关条款和政策。我们不对第三方网站的内容、隐私政策或安全性负责。
                我们保留随时修改、更新或终止本应用的权利，恕不另行通知。对于因终止或中断本应用而导致的任何损失或损害，我们概不负责。
                本免责声明的任何条款因违反适用法律而无效的部分，不影响其他条款的有效性。
                请您在使用本应用前仔细阅读本免责声明，并在必要时咨询专业人士的意见。如果您不同意本免责声明的任何部分，请停止使用本应用。如果您继续使用本应用，即表示您已经同意本免责声明的全部内容。感谢您的配合和理解！
              </p>
              <Button className="bg-blue-500 my-5" onClick={() => setTipsClose(true)}>我已经阅读并同意此声明</Button>
            </div>
          </div>
        )
      }

    </div>
  );
}
