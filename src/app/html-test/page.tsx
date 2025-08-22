
"use client";

import { useEffect } from 'react';
import Script from 'next/script';
import { BackButton } from '@/components/ui/back-button';


export default function HtmlTestPage() {

    useEffect(() => {
        // Since we are loading scripts dynamically, we need to wait for them to be ready.
        // We will check for the main libraries (THREE, TweenLite, $) before running the script.
        const interval = setInterval(() => {
            if (typeof window.THREE !== 'undefined' && typeof window.TweenLite !== 'undefined' && typeof window.$ !== 'undefined') {
                clearInterval(interval);
                
                // The provided JavaScript code starts here, adapted for the browser environment
                "use strict";

                let camera, scene, renderer;
                let plane;
                let raycaster = new window.THREE.Raycaster();
                let normalizedMouse = {
                    x: 0,
                    y: -180
                };

                let darkBlue = {
                    r: 0,
                    g: 52,
                    b: 74
                };

                let baseColorRGB = darkBlue;
                let baseColor = "rgb(" + baseColorRGB.r + "," + baseColorRGB.g + "," + baseColorRGB.b + ")";
                let nearStars, farStars, farthestStars;

                function init() {
                    scene = new window.THREE.Scene();
                    camera = new window.THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
                    renderer = new window.THREE.WebGLRenderer();

                    camera.position.z = 50;
                    
                    renderer.setClearColor( "#121212", 1.0);
                    renderer.setSize( window.innerWidth, window.innerHeight );
                    renderer.setPixelRatio( window.devicePixelRatio );

                    // Ensure we don't add the renderer more than once
                    if (!document.querySelector('canvas')) {
                        document.body.appendChild( renderer.domElement );
                    }

                    // Lights
                    let topLight = new window.THREE.DirectionalLight(0xffffff, 1);
                    topLight.position.set(0,1,1).normalize();
                    scene.add(topLight);

                    let bottomLight = new window.THREE.DirectionalLight(0xffffff, 0.4);
                    bottomLight.position.set(1,-1,1).normalize();
                    scene.add(bottomLight);

                    let skyLightRight = new window.THREE.DirectionalLight(0x666666, 0.2);
                    skyLightRight.position.set(-1,-1,0.2).normalize();
                    scene.add(skyLightRight);

                    let skyLightCenter = new window.THREE.DirectionalLight(0x666666, 0.2);
                    skyLightCenter.position.set(-0,-1,0.2).normalize();
                    scene.add(skyLightCenter);

                    let skyLightLeft = new window.THREE.DirectionalLight(0x666666, 0.2);
                    skyLightLeft.position.set(1,-1,0.2).normalize();
                    scene.add(skyLightLeft);

                    // Mesh creation
                    let geometry = new window.THREE.PlaneGeometry(400, 400, 70, 70);
                    let darkBlueMaterial = new window.THREE.MeshPhongMaterial( { color: 0xffffff, side: window.THREE.DoubleSide, vertexColors: window.THREE.FaceColors} );

                    geometry.vertices.forEach(function(vertice) {
                        vertice.x += (Math.random() - 0.5) * 4;
                        vertice.y += (Math.random() - 0.5) * 4;
                        vertice.z += (Math.random() - 0.5) * 4;
                        vertice.dx = Math.random() - 0.5;
                        vertice.dy = Math.random() - 0.5;
                        vertice.randomDelay = Math.random() * 5;
                    });

                    for ( var i = 0; i < geometry.faces.length; i ++ ) {
                        geometry.faces[ i ].color.setStyle( baseColor );
                        geometry.faces[ i ].baseColor =  baseColorRGB;    
                    }

                    plane = new window.THREE.Mesh( geometry, darkBlueMaterial );
                    scene.add( plane );

                    // Create stars 
                    farthestStars = createStars(1200, 420, "#0952BD");
                    farStars = createStars(1200, 370, "#A5BFF0");
                    nearStars = createStars(1200, 290,"#118CD6");

                    scene.add(farthestStars);
                    scene.add(farStars);
                    scene.add(nearStars);

                    farStars.rotation.x = 0.25; 
                    nearStars.rotation.x = 0.25; 
                }

                function createStars(amount, yDistance, color = "0x000000") {
                    let starGeometry = new window.THREE.Geometry();
                    let starMaterial = new window.THREE.PointsMaterial({color: color, opacity: Math.random()});

                    for (let i = 0; i < amount; i++) {
                        let vertex = new window.THREE.Vector3();
                        vertex.z = (Math.random() - 0.5) * 1500;
                        vertex.y = yDistance;
                        vertex.x = (Math.random() - 0.5) * 1500;
                        starGeometry.vertices.push(vertex);
                    }	
                    return new window.THREE.Points(starGeometry, starMaterial);
                }

                let timer = 0;

                function render() {
                    requestAnimationFrame( render );
                    timer += 0.01;
                    let vertices = plane.geometry.vertices;

                    for (let i = 0; i < vertices.length; i++) {
                        vertices[i].x -= (Math.sin(timer + vertices[i].randomDelay) / 40) * vertices[i].dx;
                        vertices[i].y += (Math.sin(timer + vertices[i].randomDelay) / 40) * vertices[i].dy;
                    }

                    raycaster.setFromCamera(normalizedMouse, camera);
                    let intersects = raycaster.intersectObjects([plane]);

                    if (intersects.length > 0) {
                        let faceBaseColor = intersects[0].face.baseColor;
                        plane.geometry.faces.forEach(function(face) {
                            face.color.r *= 255;
                            face.color.g *= 255;
                            face.color.b *= 255;

                            face.color.r += (faceBaseColor.r - face.color.r) * 0.01;
                            face.color.g += (faceBaseColor.g - face.color.g) * 0.01;
                            face.color.b += (faceBaseColor.b - face.color.b) * 0.01;

                            let rInt = Math.floor(face.color.r);
                            let gInt = Math.floor(face.color.g);
                            let bInt = Math.floor(face.color.b);

                            let newBasecol = "rgb(" + rInt + "," + gInt + "," + bInt + ")";
                            face.color.setStyle(newBasecol);
                        });
                        plane.geometry.colorsNeedUpdate = true;
                        intersects[0].face.color.setStyle("#006ea0");
                        plane.geometry.colorsNeedUpdate = true;
                    }

                    plane.geometry.verticesNeedUpdate = true;
                    plane.geometry.elementsNeedUpdate = true;

                    farthestStars.rotation.y -= 0.00001;
                    farStars.rotation.y -= 0.00005;
                    nearStars.rotation.y -= 0.00011;

                    renderer.render(scene, camera);
                }

                init();
                
                const handleResize = () => {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize( window.innerWidth, window.innerHeight );
                }
                window.addEventListener("resize", handleResize);

                const handleMouseMove = (event) => {
                    normalizedMouse.x = (event.clientX / window.innerWidth) * 2 - 1;	
                    normalizedMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;	
                }
                window.addEventListener("mousemove", handleMouseMove);

                let introContainer = window.$('.intro-container');
                let skyContainer = window.$('.sky-container');
                let xMark = window.$('.x-mark');
                
                window.$('.shift-camera-button').click(function() {
                    let introTimeline = new window.TimelineMax();
                    introTimeline.add([
                        window.TweenLite.fromTo(introContainer, 0.5, {opacity: 1}, {opacity: 0, ease: window.Power3.easeIn}),
                        window.TweenLite.to(camera.rotation, 3, {x: Math.PI / 2, ease: window.Power3.easeInOut}),
                        window.TweenLite.to(camera.position, 2.5, {z: 20, ease: window.Power3.easeInOut}),
                        window.TweenLite.to(camera.position, 3, {y: 120, ease: window.Power3.easeInOut}),
                        window.TweenLite.to(plane.scale, 3, {x: 2, ease: window.Power3.easeInOut}),
                    ]);
                    introTimeline.add([
                        window.TweenLite.to(xMark, 2, {opacity: 1, ease: window.Power3.easeInOut}),
                        window.TweenLite.to(skyContainer, 2, {opacity: 1, ease: window.Power3.easeInOut})
                    ]);
                });

                window.$('.x-mark').click(function() {
                    let outroTimeline = new window.TimelineMax();
                    outroTimeline.add([
                        window.TweenLite.to(xMark, 0.5, {opacity: 0, ease: window.Power3.easeInOut}),
                        window.TweenLite.to(skyContainer, 0.5, {opacity: 0, ease: window.Power3.easeInOut}),
                        window.TweenLite.to(camera.rotation, 3, {x: 0, ease: window.Power3.easeInOut}),
                        window.TweenLite.to(camera.position, 3, {z: 50, ease: window.Power3.easeInOut}),
                        window.TweenLite.to(camera.position, 2.5, {y: 0, ease: window.Power3.easeInOut}),
                        window.TweenLite.to(plane.scale, 3, {x: 1, ease: window.Power3.easeInOut}),
                    ]);
                    outroTimeline.add([
                        window.TweenLite.to(introContainer, 0.5, {opacity: 1, ease: window.Power3.easeIn}),
                    ]);
                });
                render();

                // Cleanup function
                return () => {
                    window.removeEventListener('resize', handleResize);
                    window.removeEventListener('mousemove', handleMouseMove);
                    if (renderer.domElement.parentElement) {
                        renderer.domElement.parentElement.removeChild(renderer.domElement);
                    }
                };
            }
        }, 100);

    }, []);

    return (
        <>
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r83/three.min.js" strategy="afterInteractive" />
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.1/TweenLite.min.js" strategy="afterInteractive" />
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.1/TimelineMax.min.js" strategy="afterInteractive" />
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.1/easing/EasePack.min.js" strategy="afterInteractive" />
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js" strategy="afterInteractive" />

            <style jsx global>{`
                body {
                    position: relative;
                    margin: 0;
                    overflow: hidden;
                    background-color: #121212;
                }
                .intro-container {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    text-align: center;
                    width: 90%;
                    z-index: 10;
                }
                h1 {
                    font-family: 'brandon-grotesque', sans-serif;
                    font-weight: bold;
                    margin-top: 0px;
                    margin-bottom: 0;
                    font-size: 20px;
                }
                @media screen and (min-width: 860px) {
                    h1 {
                        font-size: 40px;
                        line-height: 52px;
                    }
                }
                .fancy-text {
                    font-family: 'adobe-garamond-pro', sans-serif;
                    font-style: italic;
                    letter-spacing: 1px;
                    margin-bottom: 17px;
                }
                .button {
                    position: relative;
                    cursor: pointer;
                    display: inline-block;
                    font-family: 'brandon-grotesque', sans-serif;
                    text-transform: uppercase;
                    min-width: 200px;
                    margin-top: 30px;
                }
                .button:hover .border {
                    box-shadow: 0px 0px 10px 0px rgba(255, 255, 255, 1);
                }
                .button:hover .border .left-plane,
                .button:hover .border .right-plane {
                    transform: translateX(0%);
                }
                .button:hover .text {
                    color: #121212;
                }
                .button .border {
                    border: 1px solid white;
                    transform: skewX(-20deg);
                    height: 32px;
                    border-radius: 3px;
                    overflow: hidden;
                    position: relative;
                    transition: 0.1s ease-out;
                }
                .button .border .left-plane,
                .button .border .right-plane {
                    position: absolute;
                    background: white;
                    height: 32px;
                    width: 100px;
                    transition: 0.15s ease-out;
                }
                .button .border .left-plane {
                    left: 0;
                    transform: translateX(-100%);
                }
                .button .border .right-plane {
                    right: 0;
                    transform: translateX(100%);
                }
                .button .text {
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    transition: 0.15s ease-out;
                }
                .x-mark {
                    right: 10px;
                    top: 10px;
                    position: absolute;
                    cursor: pointer;
                    opacity: 0;
                    z-index: 10;
                }
                .x-mark:hover .right {
                    transform: rotate(-45deg) scaleY(1.2);
                }
                .x-mark:hover .left {
                    transform: rotate(45deg) scaleY(1.2);
                }
                .x-mark .container {
                    position: relative;
                    width: 20px;
                    height: 20px;
                }
                .x-mark .left,
                .x-mark .right {
                    width: 2px;
                    height: 20px;
                    background: white;
                    position: absolute;
                    border-radius: 3px;
                    transition: 0.15s ease-out;
                    margin: 0 auto;
                    left: 0;
                    right: 0;
                }
                .x-mark .right {
                    transform: rotate(-45deg);
                }
                .x-mark .left {
                    transform: rotate(45deg);
                }
                .sky-container {
                    position: absolute;
                    color: white;
                    text-transform: uppercase;
                    margin: 0 auto;
                    right: 0;
                    left: 0;
                    top: 2%;
                    text-align: center;
                    opacity: 0;
                    z-index: 10;
                }
                @media screen and (min-width: 860px) {
                    .sky-container {
                        top: 18%;
                        right: 12%;
                        left: auto;
                    }
                }
                .sky-container__left,
                .sky-container__right {
                    display: inline-block;
                    vertical-align: top;
                    font-weight: bold;
                }
                .sky-container__left h2,
                .sky-container__right h2 {
                    font-family: 'brandon-grotesque', sans-serif;
                    font-size: 26px;
                    line-height: 26px;
                    margin: 0;
                }
                @media screen and (min-width: 860px) {
                    .sky-container__left h2,
                    .sky-container__right h2 {
                        font-size: 72px;
                        line-height: 68px;
                    }
                }
                .sky-container__left {
                    margin-right: 5px;
                }
                .thirty-one {
                    letter-spacing: 4px;
                }
                .text-right {
                    text-align: right;
                }
                .text-left {
                    text-align: left;
                }
                .social-icon {
                    z-index: 10;
                }
                .twitter {
                    opacity: 0; /* Hidden for now */
                }
                .twitter:hover a {
                    transform: rotate(-45deg) scale(1.05);
                }
                .twitter:hover i {
                    color: #00aced;
                }
                .twitter a {
                    bottom: -40px;
                    right: -75px;
                    transform: rotate(-45deg);
                }
                .twitter i {
                    bottom: 7px;
                    right: 7px;
                    color: #00aced;
                }
                .social-icon a {
                    position: absolute;
                    background: white;
                    color: white;
                    box-shadow: -1px -1px 20px 0px rgba(0, 0, 0, 0.3);
                    display: inline-block;
                    width: 150px;
                    height: 80px;
                    transform-origin: 50% 50%;
                    transition: 0.15s ease-out;
                }
                .social-icon i {
                    position: absolute;
                    pointer-events: none;
                    z-index: 1000;
                    transition: 0.15s ease-out;
                }
                .youtube {
                     opacity: 0; /* Hidden for now */
                }
                .youtube:hover a {
                    transform: rotate(45deg) scale(1.05);
                }
                .youtube:hover i {
                    color: #e62117;
                }
                .youtube a {
                    bottom: -40px;
                    left: -75px;
                    transform: rotate(45deg);
                }
                .youtube i {
                    bottom: 7px;
                    left: 7px;
                    color: #e62117;
                }
                canvas {
                  position: fixed;
                  top: 0;
                  left: 0;
                  z-index: 1;
                }
            `}</style>
            <div className="x-mark">
                <div className="container">
                    <div className="left"></div>
                    <div className="right"></div>
                </div>
            </div>
            <div className="intro-container">
                <h2 className="fancy-text">CP Marketing Digital</h2>
                <h1>UMA AGÊNCIA COM UM DESEJO <br/> INCANSÁVEL PELO DESCONHECIDO E NÃO CONTADO</h1>

                <div className="button shift-camera-button">
                    <div className="border">
                        <div className="left-plane"></div>
                        <div className="right-plane"></div>
                    </div>	
                    <div className="text">Começar</div>
                </div>
            </div>
            <div className="sky-container">
                <div className="text-right sky-container__left">
                    <h2 className="portfolio">
                        PORTFOLIO
                    </h2>
                    <h2 className="resurrection">
                        resurrection	
                    </h2>
                </div>
                <div className="text-left sky-container__right">
                    <h2 className="08">
                        08
                    </h2>
                    <h2 className="thirty-one">
                        31
                    </h2>
                    <h2 className="2016">
                        2024
                    </h2>
                </div>
            </div>
        </>
    );
}
