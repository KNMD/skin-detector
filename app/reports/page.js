"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GaugeChart from '/components/gaugeChart';
import trans from '/public/translate.json'
const colorRange = ['sky']

function getValueByPath(obj, path) {
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    if (result[key] === undefined) {
      return undefined;
    }
    result = result[key];
  }
  return result;
}

function findScope(obj, num) {
  let advice = ""
  const keys = Object.keys(obj)
  for(let i = 0 ; i < keys.length ; i++) {
    const key = keys[i]
    const range = key.split('-').map(Number);
    advice = obj[key];
    console.log("advice: ", advice)
    if (num >= range[0] && num <= range[1]) {
        break;
    }
  }
  
  return advice
}

function urlSuffix(url) {
  if(url) {
    return url.replace(".png", ".jpg")
  }
  return url
}

export default function Report() {
  const router = useRouter();
  const [faceData, setFaceData] = useState()
  const [circles, setCircles] = useState([])
  const [skinAgeDetail, setSkinAgeDetail] = useState()
  const [wrinkleDetail, setWrinkleDetail] = useState()
  const [skinColorDetail, setSkinColorDetail] = useState()
  const [acneDetail, setAcneDetail] = useState()
  const [blackHeadDetail, setBlackHeadDetail] = useState()
  const [splashDetail, setSplashDetail] = useState()
  const [waterDetail, setWaterDetail] = useState()
  const [darkEyeCircleDetail, setDarkEyeCircleDetail] = useState()

  useEffect(()=> {
    const detectResultStr = localStorage.getItem("detectResult")
    if(!detectResultStr) {
      router.replace('/');
      return 
    }
    const data = JSON.parse(detectResultStr)
    if(data.Urls) {
      Object.keys(data.Urls).forEach(key => {
        // console.log(key, obj[key]);
        data.Urls[key] = urlSuffix(data.Urls[key])
      });
    }
    console.log("data: ", data)
    setFaceData(data)
    
    const ci = [{
      'text': '水分',
      'value': "Water.WaterScore",
      'color': 'rgb(253 186 116)',
    }, {
      'text': '皱纹',
      'value': 'Wrinkle.WrinkleScore',
      'color': 'rgb(163 230 53)',
    },{
      'text': '痘痘',
      'value': 'Acne.AcneScore',
      'color': 'rgb(6 182 212)',
    },{
      'text': '黑眼圈',
      'value': 'DarkEyeCircle.DarkEyeCircleScore',
      'color': 'rgb(99 102 241)',
    },{
      'text': '毛孔',
      'value': 'Pore.PoreScore',
      'color': 'rgb(168 85 247)',
    },{
      'text': '色斑',
      'value': 'Splash.SplashScore',
      'color': 'rgb(217 70 239)',
    },{
      'text': '黑头',
      'value': 'BlackHeads.BlackHeadsScore',
      'color': 'rgb(236 72 153)',
    }]
    
    setCircles(ci)
    setSkinAgeDetail(findScope(trans.recommend.Age, data.Age))
    setWrinkleDetail(findScope(trans.recommend.wrinkle, data.Wrinkle.WrinkleScore))
    setSkinColorDetail(findScope(trans.recommend.skinColor, data.SkinColor.SkinColorScore))
    setAcneDetail(findScope(trans.recommend.acne, data.Acne.AcneScore))
    setBlackHeadDetail(findScope(trans.recommend.blackHeads, data.BlackHeads.BlackHeadsScore))
    setSplashDetail(findScope(trans.recommend.splash, data.Splash.SplashScore))
    setWaterDetail(findScope(trans.recommend.water, data.Water.WaterScore))
    setDarkEyeCircleDetail(trans.recommend.darkEyeCircle[data.DarkEyeCircle.DarkEyeCircleStyle + ""])

  }, [])
  return (
    faceData && 
    <div className="h-screen w-screen py-6 relative">
      <img src="/beams.jpg" alt="" className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 w-screen h-screen -z-10" />
      <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] -z-10"></div>
      <div className='max-w-sm flex flex-col justify-center items-center space-y-4 mx-auto pb-5' >
        <div className=' relative text-2xl font-medium'>评测报告</div>
{/* 综合 */}
        <div className='flex justify-center ite flex-col bg-white shadow-xl rounded-xl ring-1 ring-gray-900/5'>
          <GaugeChart value={faceData.TotalScore.TotalScore} />
          <div className="grid grid-cols-3 divide-x py-6">
            <div className='flex flex-col items-center'>
              <p>肤龄</p>
              <p className=' text-2xl font-bold'>{ faceData.Age }</p>
            </div>
            <div className='flex items-center flex-col'>
              <p>肤色</p>
              <p className=' text-2xl font-bold'>{ trans['SkinColorType'][faceData.SkinColor.SkinColorType + ""] }</p>
            </div>
            <div className='flex items-center flex-col'>
              <p>肤质</p>
              <p className=' text-2xl font-bold'>{ trans['SkinTypeNum'][faceData.FaceSkinType.SkinTypeNum + ""] }</p>
            </div>
          </div>
        </div>
        <div className='flex flex-wrap justify-center bg-white shadow-xl rounded-xl ring-1 ring-gray-900/5 pb-5'>
          {
            circles.map((item, index) => {
              return (
                <div key={index} className='flex flex-col justify-center items-center'>
                  <div className='w-14 h-14 m-3 mb-1 rounded-full text-white font-medium text-xl text-center items-center flex justify-center' style={{'backgroundColor': item.color}}>{getValueByPath(faceData, item.value)}</div>
                  <p>{item.text}</p>
                </div>
              )
            })
          }
          
        </div>
{/* 肤龄 */}
        <div className='flex flex-col bg-white shadow-xl rounded-xl ring-1 ring-gray-900/5 p-5'>
          <h3 className=' text-slate-500'>肤龄：<span className=' text-xl font-medium text-black'>{faceData.Age}</span>岁</h3>
          <p className=' text-sm text-slate-700'>{skinAgeDetail.txt}</p>
          <p className={` bg-slate-100 rounded text-center p-3 mt-2 text-orange-500 font-medium text-2xl`} style={{'color': skinAgeDetail.color}}>{skinAgeDetail.level}</p>
          <div className=' text-sm my-5 text-slate-400 space-y-2 flex flex-col'>
            {
              skinAgeDetail.recommend && (<>
                <h3 className=" text-violet-400">美肤推荐：</h3>
                <span>{skinAgeDetail.recommend}</span>
              </>)
            }
            {
              skinAgeDetail.solution && (<>
                <h3 className=" text-violet-400">美肤方案：</h3>
                <span>{skinAgeDetail.solution}</span>
              </>)
            }
          </div>
        </div>
{/* 皱纹 */}
        <div className='flex flex-col bg-white shadow-xl rounded-xl ring-1 ring-gray-900/5 p-5'>
          <h3 className=' text-slate-500'>皱纹：<span className=' text-xl font-medium text-black'>{faceData.Wrinkle.WrinkleScore}</span>分 &nbsp; 皱纹个数：<span className=' text-xl font-medium text-black'>{faceData.Wrinkle.WrinkleNum}</span>个</h3>
          <p className=' text-sm text-slate-700'>{wrinkleDetail.txt}</p>
          <div className='flex mt-2'>
            {faceData.Wrinkle.ForeHeadWrinkle === 666 && <p className='p-1 bg-orange-300 rounded-xl text-sm text-orange-50 mr-2'>抬头纹</p> }
            {faceData.Wrinkle.LeftCheekWrinkle === 666 && <p className='p-1 bg-orange-300 rounded-xl text-sm text-orange-50 mr-2'>左侧脸峡皱纹</p> }
            {faceData.Wrinkle.LeftEyeBagWrinkle === 666 && <p className='p-1 bg-orange-300 rounded-xl text-sm text-orange-50 mr-2'>左眼袋</p> }
            {faceData.Wrinkle.LeftFacialWrinkle === 666 && <p className='p-1 bg-orange-300 rounded-xl text-sm text-orange-50 mr-2'>左鱼尾纹</p> }
            {faceData.Wrinkle.LeftNasolabialWrinkle === 666 && <p className='p-1 bg-orange-300 rounded-xl text-sm text-orange-50 mr-2'>左法令纹</p> }
            {faceData.Wrinkle.LipDownSideWrinkle === 666 && <p className='p-1 bg-orange-300 rounded-xl text-sm text-orange-50 mr-2'>唇下皱纹</p> }
            {faceData.Wrinkle.LipUpperSideWrinkle === 666 && <p className='p-1 bg-orange-300 rounded-xl text-sm text-orange-50 mr-2'>唇部上侧皱纹</p> }
            {faceData.Wrinkle.MidBrowWrinkle === 666 && <p className='p-1 bg-orange-300 rounded-xl text-sm text-orange-50 mr-2'>眉间皱纹</p> }
            {faceData.Wrinkle.RightCheekWrinkle === 666 && <p className='p-1 bg-orange-300 rounded-xl text-sm text-orange-50 mr-2'>右脸颊皱纹</p> }
            {faceData.Wrinkle.RightEyeBagWrinkle === 666 && <p className='p-1 bg-orange-300 rounded-xl text-sm text-orange-50 mr-2'>右眼袋</p> }
            {faceData.Wrinkle.RightNasolabialWrinkle === 666 && <p className='p-1 bg-orange-300 rounded-xl text-sm text-orange-50 mr-2'>右法令纹</p> }
          </div>
          <div className='overflow-hidden mx-auto mt-3 w-72 h-72 rounded-full bg-slate-300'>
            <img src={faceData.Urls.Wrinkle} width="100%" height="100%" />
          </div>
          <div className=' text-sm my-5 text-slate-400 space-y-2 flex flex-col'>
            {
              wrinkleDetail.recommend && (<>
                <h3 className=" text-violet-400">美肤推荐：</h3>
                <span>{wrinkleDetail.recommend}</span>
              </>)
            }
            {
              wrinkleDetail.solution && (<>
                <h3 className=" text-violet-400">美肤方案：</h3>
                <span>{wrinkleDetail.solution}</span>
              </>)
            }
          </div>
        </div>
{/* 肤色 */}
        <div className='flex flex-col bg-white shadow-xl rounded-xl ring-1 ring-gray-900/5 p-5'>
          <h3 className=' text-slate-500'>
            肤色：
            <span className=' text-xl font-medium text-black'>
            {trans['SkinColorType'][faceData.SkinColor.SkinColorType + ""]}
            </span>
          </h3>
          <p className=' text-sm text-slate-700'>{skinColorDetail.txt}</p>
          <div className='progress flex mt-8 mx-auto'>
            <div className='w-12 relative'>
              <div className='w-full h-4 rounded-l-full' style={{'backgroundColor': 'rgb(243 229 216)'}}></div>
              <div className={`w-12 h-12 rounded-full  text-white items-center flex justify-center border-4 border-white ` + (faceData.SkinColor.SkinColorType === 17 && "absolute -top-4")} style={{'backgroundColor': 'rgb(243 229 216)'}}>透白</div>
            </div>
            <div className='w-12 relative'>
              <div className=' w-full h-4' style={{'backgroundColor': 'rgb(240 203 183)'}}></div>
              <div className={`w-12 h-12 rounded-full text-white items-center flex justify-center border-4 border-white ` + (faceData.SkinColor.SkinColorType === 34 && "absolute -top-4")} style={{'backgroundColor': 'rgb(240 203 183)'}}>白皙</div>
            </div>
            <div className='w-12 relative'>
              <div className='w-full h-4' style={{'backgroundColor': 'rgb(229 191 163)'}}></div>
              <div className={`w-12 h-12 rounded-full  text-white items-center flex justify-center border-4 border-white ` + (faceData.SkinColor.SkinColorType === 51 && "absolute -top-4")} style={{'backgroundColor': 'rgb(229 191 163)'}}>自然</div>
            </div>
            <div className='w-12 relative'>
              <div className=' w-full h-4' style={{'backgroundColor': 'rgb(179 164 127)'}}></div>
              <div className={`w-12 h-12 rounded-full  text-white items-center flex justify-center border-4 border-white ` + (faceData.SkinColor.SkinColorType === 68 && "absolute -top-4")} style={{'backgroundColor': 'rgb(179 164 127)'}}>小麦</div>
            </div>
            <div className='w-12 relative'>
              <div className='w-full h-4' style={{'backgroundColor': 'rgb(143 113 94)'}}></div>
              <div className={`w-12 h-12 rounded-full  text-white items-center flex justify-center border-4 border-white ` + (faceData.SkinColor.SkinColorType === 85 && "absolute -top-4")} style={{'backgroundColor': 'rgb(143 113 94)'}}>暗沉</div>
            </div>
            <div className='w-12 relative'>
              <div className='w-full h-4 rounded-r-full' style={{'backgroundColor': 'rgb(98 75 69)'}}></div>
              <div className={`w-12 h-12 rounded-full  text-white items-center flex justify-center border-4 border-white ` + (faceData.SkinColor.SkinColorType === 0 && "absolute -top-4")} style={{'backgroundColor': 'rgb(98 75 69)'}}>黝黑</div>
            </div>
          </div>
          <div className=' text-sm my-5 text-slate-400 space-y-2 flex flex-col'>
            {
              skinColorDetail.recommend && (<>
                <h3 className=" text-violet-400">美肤推荐：</h3>
                <span>{skinColorDetail.recommend}</span>
              </>)
            }
            {
              skinColorDetail.solution && (<>
                <h3 className=" text-violet-400">美肤方案：</h3>
                <span>{skinColorDetail.solution}</span>
              </>)
            }
          </div>
        </div>
{/* 痤疮 */}
        <div className='flex flex-col bg-white shadow-xl rounded-xl ring-1 ring-gray-900/5 p-5'>
          <h3 className=' text-slate-500'>痤疮数目：<span className=' text-xl font-medium text-black'>{faceData.Acne.AcneNum}</span>个</h3>
          <p className=' text-sm text-slate-700'>{acneDetail.txt}</p>
          <div className='flex mt-2 flex-wrap'>
            {faceData.Acne.ChinAcneNum !== 0 && <p className='p-1 bg-orange-300 rounded-xl text-sm text-orange-50 text-nowrap m-2'>下巴区域痤疮数目: {faceData.Acne.ChinAcneNum}</p> }
            {faceData.Acne.ChinSmallPoxNum !== 0 && <p className='p-1 bg-orange-300 rounded-xl text-sm text-orange-50 text-nowrap m-2'>下巴区域痘印数目: {faceData.Acne.ChinSmallPoxNum}</p> }
            {faceData.Acne.ForeHeadAcneNum !== 0 && <p className='p-1 bg-orange-300 rounded-xl text-sm text-orange-50 text-nowrap m-2'>额头区域痤疮数目: {faceData.Acne.ForeHeadAcneNum}</p> }
            {faceData.Acne.ForeHeadSmallPoxNum !== 0 && <p className='p-1 bg-orange-300 rounded-xl text-sm text-orange-50 text-nowrap m-2'>额头区域痘印数目: {faceData.Acne.ForeHeadSmallPoxNum}</p> }
            {faceData.Acne.LeftFaceAcneNum !== 0 && <p className='p-1 bg-orange-300 rounded-xl text-sm text-orange-50 text-nowrap m-2'>左脸区域痤疮数目: {faceData.Acne.LeftFaceAcneNum}</p> }
            {faceData.Acne.LeftFaceSmallPoxNum !== 0 && <p className='p-1 bg-orange-300 rounded-xl text-sm text-orange-50 text-nowrap m-2'>左脸区域痘印数目: {faceData.Acne.LeftFaceSmallPoxNum}</p> }
            {faceData.Acne.NoseAreaAcneNum !== 0 && <p className='p-1 bg-orange-300 rounded-xl text-sm text-orange-50 text-nowrap m-2'>鼻子区域痤疮数目: {faceData.Acne.NoseAreaAcneNum}</p> }
            {faceData.Acne.NoseAreaSmallPoxNum !== 0 && <p className='p-1 bg-orange-300 rounded-xl text-sm text-orange-50 text-nowrap m-2'>鼻子区域痘印数目: {faceData.Acne.NoseAreaSmallPoxNum}</p> }
            {faceData.Acne.RightFaceAcneNum !== 0 && <p className='p-1 bg-orange-300 rounded-xl text-sm text-orange-50 text-nowrap m-2'>右脸区域痤疮数目: {faceData.Acne.RightFaceAcneNum}</p> }
            {faceData.Acne.RightFaceSmallPoxNum !== 0 && <p className='p-1 bg-orange-300 rounded-xl text-sm text-orange-50 text-nowrap m-2'>右脸区域痘印数目: {faceData.Acne.RightFaceSmallPoxNum}</p> }
            {faceData.Acne.UpperLipAcneNum !== 0 && <p className='p-1 bg-orange-300 rounded-xl text-sm text-orange-50 text-nowrap m-2'>上唇区域痤疮数目: {faceData.Acne.UpperLipAcneNum}</p> }
            {faceData.Acne.UpperLipSmallPoxNum !== 0 && <p className='p-1 bg-orange-300 rounded-xl text-sm text-orange-50 text-nowrap m-2'>上唇区域痘印数目: {faceData.Acne.UpperLipSmallPoxNum}</p> }
          </div>
          <div className='overflow-hidden mx-auto mt-3 w-72 h-72 rounded-full bg-slate-300'>
            <img src={faceData.Urls.Acne} width="100%" height="100%" />
          </div>
          <div className=' text-sm my-5 text-slate-400 space-y-2 flex flex-col'>
            {
              acneDetail.recommend && (<>
                <h3 className=" text-violet-400">美肤推荐：</h3>
                <span>{acneDetail.recommend}</span>
              </>)
            }
            {
              acneDetail.solution && (<>
                <h3 className=" text-violet-400">美肤方案：</h3>
                <span>{acneDetail.solution}</span>
              </>)
            }
          </div>
        </div>
{/* 黑头 */}
        <div className='flex flex-col bg-white shadow-xl rounded-xl ring-1 ring-gray-900/5 p-5'>
          <h3 className=' text-slate-500'>黑头：<span className=' text-xl font-medium text-black'>{faceData.BlackHeads.BlackHeadsNum}</span>个</h3>
          <p className=' text-sm text-slate-700'>{blackHeadDetail.txt}</p>
          
          <div className='overflow-hidden mx-auto mt-3 w-72 h-72 rounded-full bg-slate-300'>
            <img src={faceData.Urls.BlackHeads} width="100%" height="100%" />
          </div>
          <div className=' text-sm my-5 text-slate-400 space-y-2 flex flex-col'>
            {
              blackHeadDetail.recommend && (<>
                <h3 className=" text-violet-400">美肤推荐：</h3>
                <span>{blackHeadDetail.recommend}</span>
              </>)
            }
            {
              blackHeadDetail.solution && (<>
                <h3 className=" text-violet-400">美肤方案：</h3>
                <span>{blackHeadDetail.solution}</span>
              </>)
            }
          </div>
        </div>
{/* 色斑 */}
        <div className='flex flex-col bg-white shadow-xl rounded-xl ring-1 ring-gray-900/5 p-5'>
          <h3 className=' text-slate-500'>色斑<span className=' text-xl font-medium text-black'>{faceData.Splash.SplashNum}</span>个</h3>
          <p className=' text-sm text-slate-700'>{splashDetail.txt}</p>
          
          {
            faceData.Splash.SplashScore === 100 && 
            <div className='mt-5'>
              <div className='w-full overflow-hidden bg-purple-100 h-3 rounded-full'>
                <div className='h-3 bg-purple-300' style={{width: '33%'}}></div>
              </div>
              <div className='w-full grid grid-cols-3 text-center mt-5'>
                {splashDetail.type === 'little' && <><div className='text-purple-300'>轻度</div><div>中度</div><div>重度</div></>}
                {splashDetail.type === 'middle' && <><div>轻度</div><div className='text-purple-400'>中度</div><div>重度</div></>}
                {splashDetail.type === 'little' && <><div>轻度</div><div></div><div className='text-purple-500'>重度</div></>}
              </div>
            </div>   
          } 
          <div className='overflow-hidden mx-auto mt-3 w-72 h-72 rounded-full bg-slate-300'>
            <img src={faceData.Urls.Splash} width="100%" height="100%" />
          </div>
          
          <div className=' text-sm my-5 text-slate-400 space-y-2 flex flex-col'>
            {
              splashDetail.recommend && (<>
                <h3 className=" text-violet-400">美肤推荐：</h3>
                <span>{splashDetail.recommend}</span>
              </>)
            }
            {
              splashDetail.solution && (<>
                <h3 className=" text-violet-400">美肤方案：</h3>
                <span>{splashDetail.solution}</span>
              </>)
            }
          </div>
        </div>
{/* 水分 */}
        <div className='flex flex-col bg-white shadow-xl rounded-xl ring-1 ring-gray-900/5 p-5'>
          <h3 className=' text-slate-500'>水分<span className=' text-xl font-medium text-black'>{faceData.Water.WaterScore}</span>分</h3>
          <p className=' text-sm text-slate-700'>{waterDetail.txt}</p>
          
          <div className='overflow-hidden mx-auto mt-3 w-72 h-72 rounded-full bg-slate-300'>
            <img src={faceData.Urls.Water} width="100%" height="100%" />
          </div>

          <div className=' text-sm my-5 text-slate-400 space-y-2 flex flex-col'>
            {
              waterDetail.recommend && (<>
                <h3 className=" text-violet-400">美肤推荐：</h3>
                <span>{waterDetail.recommend}</span>
              </>)
            }
            {
              waterDetail.solution && (<>
                <h3 className=" text-violet-400">美肤方案：</h3>
                <span>{waterDetail.solution}</span>
              </>)
            }
          </div>
          
        </div>
{/* 黑眼圈 */}
        <div className='flex flex-col bg-white shadow-xl rounded-xl ring-1 ring-gray-900/5 p-5'>
          <h3 className=' text-slate-500'>黑眼圈
            {faceData.DarkEyeCircle.DarkEyeCircleStyle === 0 && <span className=' pl-3 text-xl font-medium text-black'>无黑圆圈</span>}
            {faceData.DarkEyeCircle.DarkEyeCircleStyle === 17 && <span className=' pl-3 text-xl font-medium text-black'>轻度</span>}
            {faceData.DarkEyeCircle.DarkEyeCircleStyle === 34 && <span className=' pl-3 text-xl font-medium text-black'>中度</span>}
            {faceData.DarkEyeCircle.DarkEyeCircleStyle === 51 && <span className=' pl-3 text-xl font-medium text-black'>重度</span>}
          </h3>
          <p className=' text-sm text-slate-700'>{darkEyeCircleDetail.txt}</p>
          <div className='overflow-hidden mx-auto mt-3 w-72 h-72 rounded-full bg-slate-300'>
            <img src={faceData.Urls.DarkEyeCircle} width="100%" height="100%" />
          </div>
          <div className=' text-sm my-5 text-slate-400 space-y-2 flex flex-col'>
            {
              darkEyeCircleDetail.recommend && (<>
                <h3 className=" text-violet-400">美肤推荐：</h3>
                <span>{darkEyeCircleDetail.recommend}</span>
              </>)
            }
            {
              darkEyeCircleDetail.solution && (<>
                <h3 className=" text-violet-400">美肤方案：</h3>
                <span>{darkEyeCircleDetail.solution}</span>
              </>)
            }
          </div>
        </div>
{/* 毛孔 */}
        <div className='flex flex-col bg-white shadow-xl rounded-xl ring-1 ring-gray-900/5 p-5'>
          <h3 className=' text-slate-500'>毛孔：<span className=' text-xl font-medium text-black'>{faceData.Pore.PoreScore}</span>分 &nbsp; 毛孔个数：<span className=' text-xl font-medium text-black'>{faceData.Pore.PoreNum}</span>个</h3>
          <div className='flex mt-2 flex-wrap'>
            {faceData.Pore.ChinPoreNum !== 0 && <p className='p-1 bg-rose-500 rounded-xl text-sm text-orange-50 text-nowrap m-2'>下巴区域: {faceData.Pore.ChinPoreNum}</p> }
            {faceData.Pore.ForeHeadPoreNum !== 0 && <p className='p-1 bg-rose-500 rounded-xl text-sm text-orange-50 text-nowrap m-2'>额头区域: {faceData.Pore.ForeHeadPoreNum}</p> }
            {faceData.Pore.LeftFacePoreNum !== 0 && <p className='p-1 bg-rose-500 rounded-xl text-sm text-orange-50 text-nowrap m-2'>左脸区域: {faceData.Pore.LeftFacePoreNum}</p> }
            {faceData.Pore.NoseAreaPoreNum !== 0 && <p className='p-1 bg-rose-500 rounded-xl text-sm text-orange-50 text-nowrap m-2'>鼻子区域: {faceData.Pore.NoseAreaPoreNum}</p> }
            {faceData.Pore.RightFacePoreNum !== 0 && <p className='p-1 bg-rose-500 rounded-xl text-sm text-orange-50 text-nowrap m-2'>右脸区域: {faceData.Pore.RightFacePoreNum}</p> }
            {faceData.Pore.UpperLipPoreNum !== 0 && <p className='p-1 bg-rose-500 rounded-xl text-sm text-orange-50 text-nowrap m-2'>上唇区域: {faceData.Pore.UpperLipPoreNum}</p> }
          </div>
        </div>
        
        {/* <button className='my-5 bg-pink-400 text-white font-bold w-full rounded py-2 shadow-sm'>查看治疗方案</button>   */}
      </div>
      
      
    </div>
  );
}