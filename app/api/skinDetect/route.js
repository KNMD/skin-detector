import { NextResponse } from 'next/server'
import crypto from 'crypto';

// const GMT_FORMAT = 'ddd, DD MMM YYYY HH:mm:ss [GMT]';
// hmac id="AKIDgZ23e5v6b6525V9g9IJ7N08lVA1LHQD8afXA", algorithm="hmac-sha1", headers="date source", signature="98Tvkh9Dhm2rR+l9fdEb7oqoOp0="
// Sat, 16 Mar 2024 10:28:22 GMT
// hmac id="AKIDgZ23e5v6b6525V9g9IJ7N08lVA1LHQD8afXA"", algorithm="hmac-sha1", headers="date source", signature="ObaM8bNE3fg3pvnF3K8zER4g9BE="
function getSimpleSign(source, SecretId, SecretKey) {
  console.log("SecretId, SecretKey: ", SecretId, SecretKey)
  const dateTime = new Date().toUTCString();
  const auth = `hmac id="${SecretId}", algorithm="hmac-sha1", headers="date source", signature="`;
  const signStr = `date: ${dateTime}\nsource: ${source}`;
  const sign = crypto.createHmac('sha1', SecretKey).update(signStr).digest();
  const encodedSign = Buffer.from(sign).toString('base64');
  const signature = auth + encodedSign + "\"";
  return [signature, dateTime];
}

export async function POST(req, res)  {
  const data = await req.formData()
  const file = data.get('file')
  // 将文件流转换为 Buffer
  const fileBuffer = await file.arrayBuffer();
  // 将 Buffer 转换为 Base64
  const base64 = "data:image/png;base64," + Buffer.from(fileBuffer).toString('base64');
  
  const source = 'skin-detector';
  const [signature, dateTime] = getSimpleSign(source, process.env.NEXT_PUBLIC_SECRET_ID, process.env.NEXT_PUBLIC_SECRET_KEY);
  const url = process.env.NEXT_PUBLIC_FACE_SKIN_API
  const dataPost = new URLSearchParams();
  dataPost.append('Image', base64);

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    'Authorization': signature,
    'Date': dateTime,
    'Source': source
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: dataPost,
    timeout: 600000,
  });
 
  const responseJSON = await response.json()
  console.log("responseJSON: ", responseJSON)


  // const mock = {"Code":0,"Message":"Success","Data":{"Acne":{"AcneNum":11,"AcneScore":90,"ChinAcneNum":1,"ChinSmallPoxNum":0,"ForeHeadAcneNum":5,"ForeHeadSmallPoxNum":0,"LeftFaceAcneNum":2,"LeftFaceSmallPoxNum":0,"NoseAreaAcneNum":0,"NoseAreaSmallPoxNum":0,"RightFaceAcneNum":3,"RightFaceSmallPoxNum":0,"SmallPoxNum":0,"UpperLipAcneNum":0,"UpperLipSmallPoxNum":0},"BlackHeads":{"BlackHeadsNum":0,"BlackHeadsRatio":0,"BlackHeadsScore":100},"DarkEyeCircle":{"DarkEyeCircleScore":97,"DarkEyeCircleStyle":0},"FaceSkinType":{"SkinType":"hun he","SkinTypeNum":51},"FinishTime":{"Time":"Tue Mar 12 14:28:20 2024"},"Pore":{"ChinPoreNum":2,"ForeHeadPoreNum":42,"LeftFacePoreNum":3,"NoseAreaPoreNum":7,"PoreNum":72,"PoreRatio":20.95013278253172,"PoreScore":98,"RightFacePoreNum":13,"UpperLipPoreNum":5},"Roughness":{"RoughnessScore":89},"SkinColor":{"SkinColor":"an chen","SkinColorScore":75,"SkinColorType":85},"Splash":{"ChinSplashNum":0,"ForeHeadSplashNum":4,"LeftFaceSplashNum":0,"NoseAreaSplashNum":2,"RightFaceSplashNum":0,"SplashNum":6,"SplashRatio":0,"SplashScore":96,"UpperLipSplashNum":0},"StartTime":{"Time":"Tue Mar 12 14:28:20 2024"},"Texture":{"TextureScore":98},"Time":{"TotalTime":578},"Version":"3.0.0","Water":{"GeneralRatio":0.5259116476015926,"GoodRatio":0.0753649750363395,"PoorRatio":0.3972065979902673,"VeryGoodRatio":0.001516779371800544,"VeryPoorRatio":0,"WaterScore":56},"Wrinkle":{"ForeHeadWrinkle":666,"LeftCheekWrinkle":0,"LeftEyeBagWrinkle":0,"LeftFacialWrinkle":666,"LeftNasolabialWrinkle":0,"LipDownSideWrinkle":0,"LipUpperSideWrinkle":0,"MidBrowWrinkle":0,"RightCheekWrinkle":0,"RightEyeBagWrinkle":666,"RightFacialWrinkle":666,"RightNasolabialWrinkle":666,"WrinkleNum":17,"WrinkleScore":67},"result_type":666,"TotalScore":{"TotalScore":86},"Token":"S3s27THhb8","Age":40,"Glass":1,"Gender":99,"Beauty":39.53,"FaceShape":{"face_profile":[{"x":166.17,"y":214.77},{"x":166.82,"y":244.54},{"x":170.09,"y":274.55},{"x":176.54,"y":304.55},{"x":194.7,"y":334.66},{"x":222.78,"y":358.19},{"x":252.58,"y":367.85},{"x":284.5,"y":363.1},{"x":317.11,"y":343.56},{"x":341.72,"y":313.78},{"x":351.9,"y":282.51},{"x":357.47,"y":251.2},{"x":360.55,"y":219.97}],"left_eye":[{"x":197.85,"y":219.61},{"x":206.71,"y":213.67},{"x":216.12,"y":212.34},{"x":225.05,"y":215.28},{"x":232.53,"y":224.19},{"x":224.06,"y":225.28},{"x":214.43,"y":225.61},{"x":205.16,"y":223.48}],"right_eye":[{"x":280.01,"y":226.26},{"x":287.83,"y":218.03},{"x":297.12,"y":215.9},{"x":306.78,"y":217.69},{"x":315.78,"y":224.09},{"x":307.52,"y":227.52},{"x":297.78,"y":228.93},{"x":288.51,"y":228.04}],"left_eyebrow":[{"x":183.93,"y":197.31},{"x":195.65,"y":184.99},{"x":210.42,"y":183.69},{"x":224.42,"y":186.56},{"x":236.63,"y":196.97},{"x":223.29,"y":195.78},{"x":209.82,"y":194.48},{"x":196.38,"y":195.23}],"right_eyebrow":[{"x":273.9,"y":198.35},{"x":287.49,"y":188.96},{"x":302.43,"y":187.51},{"x":318.1,"y":190.4},{"x":331.26,"y":203.2},{"x":316.76,"y":200.2},{"x":302.28,"y":198.67},{"x":288.1,"y":198.48}],"mouth":[{"x":222.56,"y":310.49},{"x":237.65,"y":305.78},{"x":253.26,"y":306.43},{"x":270.03,"y":307.33},{"x":286.9,"y":313.16},{"x":271.02,"y":321.27},{"x":252.98,"y":324.07},{"x":236.02,"y":320.04},{"x":237.83,"y":311.69},{"x":253.2,"y":313.45},{"x":269.41,"y":313.06},{"x":269.3,"y":313.81},{"x":253.39,"y":313.76},{"x":237.93,"y":312.76}],"nose":[{"x":243.89,"y":225.4},{"x":239.75,"y":242.69},{"x":235.46,"y":260.09},{"x":228.99,"y":278.36},{"x":240.45,"y":280.37},{"x":266.37,"y":280.92},{"x":279.39,"y":280.17},{"x":273.29,"y":261.28},{"x":270.1,"y":243.8},{"x":267.01,"y":226.39},{"x":252.58,"y":269.6}]},"Urls":{"Origin":"https:\/\/ym.pandaguangguang.com\/faceprocess\/202403\/12\/0fda70107c765367\/a4fe02dbadaade77.jpg","Splash":"https:\/\/ym.pandaguangguang.com\/faceprocess\/202403\/12\/0fda70107c765367\/a4fe02dbadaade77_1.jpg","Acne":"https:\/\/ym.pandaguangguang.com\/faceprocess\/202403\/12\/0fda70107c765367\/a4fe02dbadaade77_2.jpg","Wrinkle":"https:\/\/ym.pandaguangguang.com\/faceprocess\/202403\/12\/0fda70107c765367\/a4fe02dbadaade77_3.jpg","Pore":"https:\/\/ym.pandaguangguang.com\/faceprocess\/202403\/12\/0fda70107c765367\/a4fe02dbadaade77_4.jpg","Blood":"https:\/\/ym.pandaguangguang.com\/faceprocess\/202403\/12\/0fda70107c765367\/a4fe02dbadaade77_5.jpg","Water":"https:\/\/ym.pandaguangguang.com\/faceprocess\/202403\/12\/0fda70107c765367\/a4fe02dbadaade77_6.jpg","BlackHeads":"https:\/\/ym.pandaguangguang.com\/faceprocess\/202403\/12\/0fda70107c765367\/a4fe02dbadaade77_7.jpg","Texture":"https:\/\/ym.pandaguangguang.com\/faceprocess\/202403\/12\/0fda70107c765367\/a4fe02dbadaade77_8.jpg","Roughness":"https:\/\/ym.pandaguangguang.com\/faceprocess\/202403\/12\/0fda70107c765367\/a4fe02dbadaade77_9.jpg","AntiWrinkle":"https:\/\/ym.pandaguangguang.com\/faceprocess\/202403\/12\/0fda70107c765367\/a4fe02dbadaade77_10.jpg","EyeliftShow":"https:\/\/ym.pandaguangguang.com\/faceprocess\/202403\/12\/0fda70107c765367\/a4fe02dbadaade77_11.jpg","DarkEyeCircle":"https:\/\/ym.pandaguangguang.com\/faceprocess\/202403\/12\/0fda70107c765367\/a4fe02dbadaade77_12.jpg","EyeliftShow_AntiWrinkle":"https:\/\/ym.pandaguangguang.com\/faceprocess\/202403\/12\/0fda70107c765367\/a4fe02dbadaade77_13.jpg"}}}

  return NextResponse.json(responseJSON)
}