import './App.css';

import * as THREE from 'three'
import React, { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useLoader, useThree } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OrbitControls } from '@react-three/drei'
import { nanoid } from 'nanoid'
import { useSpring, animated, config } from 'react-spring'
import { useInView } from 'react-intersection-observer';

const getUrl = (path) => `${process.env.PUBLIC_URL}/assets${path}`

function App() {

  const planet = useRef()
  const planet1 = useRef()
  const donut = useRef()
  const meRef = useRef()
  const orbital = useRef()

  useEffect(() => {
    window.scrollTo(0,0)
    document.body.style.overflowY = "hidden"
  },[])

  function Model({iref, path, scale, position}) {
    const fbx = useLoader(FBXLoader, path)
    return (
    <mesh
    scale={scale}
    position={position}
    ref={iref}
    >
      <primitive object={fbx} />
    </mesh>
    )
  }

  function MeBox() {
    const meTexture = useLoader(THREE.TextureLoader, getUrl("/Me.jpg"))

    return (
      <mesh
      ref={meRef}
      position={[-20,20,30]}
      >
        <boxGeometry attach="geometry" args={[5,5,5]}></boxGeometry>
        <meshBasicMaterial attach="material" map={meTexture}></meshBasicMaterial>
      </mesh>
    )
  }

  function Environment() {
    const { scene, camera } = useThree()

    const [introfinish, setintrofinish] = useState(false)

    useEffect(() => {
      if(introfinish) {
        document.body.style.overflowY = "scroll"
        orbital.current.enabled = true
        document.body.onscroll = () => {
          const t = document.body.getBoundingClientRect().top;

          planet.current.rotation.y = t * 0.001
          planet1.current.rotation.y = t * 0.001
          planet1.current.rotation.z = t * 0.001
          meRef.current.rotation.y = t * 0.001
          meRef.current.rotation.z = t * 0.001
          donut.current.rotation.y = t * 0.001
          donut.current.rotation.z = t * 0.001
          camera.position.z = 30 + t * -0.025 ;
          camera.position.x = t * -0.0002;
          camera.position.y = 20 + t * -0.01;
        }
      }
   },[introfinish])

    useFrame((state, delta) => {
      if(camera.position.z >= 31 && !introfinish) {
        camera.position.y = THREE.MathUtils.damp(50,20,100,state.clock.elapsedTime / 100)
        camera.position.z = THREE.MathUtils.damp(80,30,100,state.clock.elapsedTime / 100)
        planet.current.rotation.y  = THREE.MathUtils.damp(-1.5708,1.5708,100,state.clock.elapsedTime / 100)
      }
      else {
        if(introfinish === false)
          setintrofinish(true)
      }
    })

    const bg = useLoader(THREE.TextureLoader, getUrl("/SimpleSky.png"))

    useEffect(() => {
      scene.background = bg
    }, [])
    return null
  }

  function addStar() {
    const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread (300))
    return (
      <mesh
      key={nanoid()}
      position={[x,y,z]}
      >
        <sphereGeometry
        args={[0.25, 24, 24]}
        />
        <meshStandardMaterial attach="material" color="white"></meshStandardMaterial>
      </mesh>
    )
  }

  const springHeader = useSpring({from: { scale: 0, opacity: 0}, to: {scale: 1, opacity: 1},config: config.slow, delay: 3000})

  const SpringInView = ({ side, children}) => {
    const { ref, inView} = useInView({triggerOnce: true});
    const springBox = useSpring(
      {to: {scale: inView? 1: 0, opacity: inView? 1: 0},
      config: config.wobbly, delay: 200})

    return (
      <div ref={ref} className={`${side}Section`}>
        <animated.section style={springBox}>
          {children}
        </animated.section>
      </div>
    );
  };

  return (
    <div className="App">
      <div className="canvasContainer">
        <Canvas
        camera={{fov: 75, aspect: window.innerWidth / window.innerHeight, position: [0,50,80]}}
        >
          <OrbitControls ref={orbital} enabled={false}></OrbitControls>
          <ambientLight />
          <Suspense fallback={null}>
            <Environment></Environment>
            {Array(400).fill().map(() => addStar())}
            <Model iref={planet} path={getUrl("/Models/Island1.fbx")} scale={0.01} position={[0,0,0]}></Model>
            <Model iref={planet1} path={getUrl("/Models/ShepherdPlanet.fbx")} scale={0.01} position={[20,40,40]}></Model>
            <Model iref={donut} path={getUrl("/Models/donutblend.fbx")} scale={6} position={[-50,50,70]}></Model>
            <MeBox></MeBox>
          </Suspense>
        </Canvas>
      </div>

      <div className="welcomeContainer">
        <animated.div style={springHeader}>
          <span>WELCOME TO MY PLANET</span>
          <span>Yiming Wang</span>
        </animated.div>
      </div>

      <main>
        <blockquote>
          <span>"I play games, I make games.......And websites"</span>
        </blockquote>

        <SpringInView side='left'>
          <h2>Cyber Detective</h2>
          <h4>Self Game Dev Project</h4>
          <div className="projectWrapper">
            <div className="introContainer">

              <h3>Intro</h3>
              <p>In this game, you will try to solve crime scenes 
                by hearing stories, collecting evidences and making judgements. 
                This game is meant to submerge the player in crime scenes and 
                encourage them to think carefully and connect evidences to find the criminal.</p>
            </div>
            <div className="demoContainer">
              <h3>Demo (<a href="https://yiw679.github.io/Detective-Storyline-GameDev/" target="_blank" rel="noopener noreferrer"> Try it out </a>)</h3>
              <div id="cdSlides" className="carousel slide demoSlidesContainer" data-bs-ride="carousel">
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img src={getUrl("/CyberDetective/capture1.png")} className="d-block w-100" alt="..."/>
                  </div>
                  <div className="carousel-item">
                    <img src={getUrl("/CyberDetective/capture2.png")} className="d-block w-100" alt="..."/>
                  </div>
                  <div className="carousel-item">
                    <img src={getUrl("/CyberDetective/capture3.png")} className="d-block w-100" alt="..."/>
                  </div>
                  <div className="carousel-item">
                    <img src={getUrl("/CyberDetective/capture4.png")} className="d-block w-100" alt="..."/>
                  </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#cdSlides" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#cdSlides" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </SpringInView>

        <SpringInView side='right'>
          <h2>Spurpunk</h2>
          <h4>EasleyDunn Productions (Role: Developer)</h4>
          <div className="projectWrapper">
            <div className="demoContainer">
              <h3>Demo (<a href="http://easleydunnproductions.com/spurpunk/" target="_blank" rel="noopener noreferrer"> Try it out </a>)</h3>
              <div id="spurpunkSlides" className="carousel slide demoSlidesContainer" data-bs-ride="carousel">
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img src={getUrl("/Spurpunk/capture1.png")} className="d-block w-100" alt="..."/>
                  </div>
                  <div className="carousel-item">
                    <img src={getUrl("/Spurpunk/capture2.png")} className="d-block w-100" alt="..."/>
                  </div>
                  <div className="carousel-item">
                    <img src={getUrl("/Spurpunk/capture3.png")} className="d-block w-100" alt="..."/>
                  </div>
                  <div className="carousel-item">
                    <img src={getUrl("/Spurpunk/capture4.png")} className="d-block w-100" alt="..."/>
                  </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#spurpunkSlides" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#spurpunkSlides" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
            <div className="introContainer">
            <h3>Intro</h3>
            <p>A tower defense game with a steampunk twist -- You are the cardslinger,
               using magical cards and keep the monsters at bay through the ghost town
                -- but you have no control over the cards you are dealt! A fast-paced 
                game of strategy, power and the luck of the draw.</p>
            </div>
          </div>
        </SpringInView>

        <SpringInView side='left'>
          <h2>Tai-Chi Master</h2>
          <h4>School Project (Role: Developer)</h4>
          <div className="projectWrapper">
            <div className="introContainer">

              <h3>Intro</h3>
              <p>You are the greatest Tai Chi Master, and the world is suffering 
                from the Yin Yang monsterDefeat the monsters and save the world!
                Watch out for your Yin Yang power balance, or it will cause Qigong 
                deviation and hurt you.</p>
            </div>
            <div className="demoContainer">
              <h3>Demo (<a href="https://rick-jwq.github.io/Try-Not-To-Die/" target="_blank" rel="noopener noreferrer"> Try it out </a>)</h3>
              <div id="tmSlides" className="carousel slide demoSlidesContainer" data-bs-ride="carousel">
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img src={getUrl("/TaichiMaster/capture1.png")} className="d-block w-100" alt="..."/>
                  </div>
                  <div className="carousel-item">
                    <img src={getUrl("/TaichiMaster/capture2.png")} className="d-block w-100" alt="..."/>
                  </div>
                  <div className="carousel-item">
                    <img src={getUrl("/TaichiMaster/capture3.png")} className="d-block w-100" alt="..."/>
                  </div>
                  <div className="carousel-item">
                    <img src={getUrl("/TaichiMaster/capture4.png")} className="d-block w-100" alt="..."/>
                  </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#tmSlides" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#tmSlides" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </SpringInView>
      </main>
    </div>
  );
}

export default App;
