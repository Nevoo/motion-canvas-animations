import { Layout, Node, Rect, Txt, makeScene2D } from "@motion-canvas/2d";
import { OrbitImages } from "../components/orbit-images";
import {
    DEFAULT,
    Direction,
    Reference,
    SignalValue,
    Vector2,
    all,
    createRef,
    createSignal,
    easeInCubic,
    easeInOutCubic,
    easeInOutQuad,
    linear,
    makeRef,
    sequence,
    slideTransition,
    tween,
    useScene,
    waitFor,
    waitUntil,
} from "@motion-canvas/core";
import { orbit } from "../three/normals";
import { BlackLabel, Colors, WhiteLabel } from "../../styles";
import { Three } from "../components/Three";
import * as orbitImages from "../three/orbit_images";
import {
    CodeBlock,
    edit,
    insert,
    lines,
    remove,
} from "@motion-canvas/2d/lib/components/CodeBlock";

export default makeScene2D(function* (view) {
    const previewSize = view.size().sub(160);
    const three = createRef<Three>();
    const headline = createRef<Txt>();
    const scenePosition = createSignal(new Vector2(0, 0));

    yield* slideTransition(Direction.Right);

    view.add(
        <Three
            opacity={0}
            ref={three}
            quality={2}
            width={1920}
            height={1080}
            zoom={100}
            position={scenePosition}
            background={"#0f0e17"}
            scene={orbitImages.threeScene}
            camera={orbitImages.camera}
        />
    );

    view.add(
        <Txt
            ref={headline}
            opacity={0}
            {...WhiteLabel}
            fontSize={40}
            y={-400}
            // x={-0}
            text={"Imagine a top down view"}
        />
    );

    const orbitX = createSignal(Math.PI / 2);
    const orbitY = createSignal(Math.PI);

    useScene().lifecycleEvents.onBeginRender.subscribe(() => {
        orbitImages.orbit.rotation.set(orbitX(), orbitY(), 0, "XYZ");
        // orbitImages.planes.forEach((plane) => plane.rotation.set(0, 0, 0));
    });

    orbitImages.planeGroup.rotation.set(0, 0, 0);

    orbitImages.planes.forEach((plane) => {
        plane.position.set(0, 0, 0);
        plane.rotation.set(0, 0, 0);
    });

    yield* all(three().opacity(1, 1), headline().opacity(1, 1));

    yield* sequence(
        0.2,
        ...orbitImages.planes.map((plane, i) =>
            tween(0.5, (value) => {
                plane.position.set(
                    easeInOutCubic(
                        value,
                        0,
                        calcXPos(i, orbitImages.planes.length)
                    ),
                    0,
                    easeInOutCubic(
                        value,
                        0,
                        calcZPos(i, orbitImages.planes.length)
                    )
                );
            })
        )
    );

    yield* waitUntil("fCircle");

    // yield* orbitY(-(Math.PI / 2), 1);

    // yield* sequence(
    //     0.2,
    //     ...orbitImages.planes.map((plane, i) =>
    //         tween(0.5, (value) => {
    //             plane.rotation.y = easeInOutCubic(
    //                 value,
    //                 Math.PI,
    //                 calculatePosition(i, orbitImages.planes.length)
    //             );
    //         })
    //     )
    // );

    yield* all(
        orbitX(0, 1),
        headline().position([0, -800], 1),
        headline().opacity(0, 1)
    );

    yield* tween(1, (value) => {
        orbitImages.planeGroup.rotation.set(
            0,
            easeInOutCubic(value, 0, Math.PI),
            0
        );
    });

    yield* scenePosition(new Vector2([-2500, 0]), 1);

    const layout = createRef<Layout>();
    const [codeRef1, rectRef1, rect1] = codeRect(
        previewSize,
        8,
        `
        let rotation = [
            0, 
            0, 
            0
        ];`
    );

    const [codeRef2, rectRef2, rect2] = codeRect(
        previewSize,
        1,
        `
        let position = [
            radius * Math.sin((index * 2 * Math.PI) / images.length),
            0,
            radius * Math.cos((index * 2 * Math.PI) / images.length),
        ]`
    );

    yield* all(
        rectRef1().scale(0, 0.2),
        rectRef2().scale(0, 0.2),
        rectRef2().grow(0, 0.2)
    );

    const background = createRef<Rect>();

    view.add(
        <Node>
            <Rect
                ref={background}
                size={previewSize.add(160)}
                x={-previewSize.add(160).width}
            />
            <Layout layout ref={layout} gap={50} padding={50}>
                {rect1}
                {rect2}
            </Layout>
        </Node>
    );

    yield* sequence(
        0.3,
        background().x(0, 2),
        background().fill(Colors.TERTIARY, 0.8)
    );

    yield* waitFor(2);

    yield* rectRef1().scale(1, 0.5);
    yield* codeRef1().opacity(1, 1);

    yield* waitUntil("easier");

    yield* codeRef1().edit(1)`
let rotation = [
    0,
    ${edit("0", "(index * 2 * Math.PI) / images.length")},
    0
];`;

    yield* waitUntil("diff");

    yield* rectRef2().scale(1, 1);
    yield* codeRef2().opacity(1, 1);

    yield* waitUntil("axis");

    yield* all(
        codeRef1().position([0, -300], 1),
        rectRef2().scale(0, 0.5),
        sequence(
            0.3,
            background().x(-previewSize.add(160).width, 2),
            background().fill(Colors.background, 0.8)
        )
    );

    yield* scenePosition(new Vector2([400, 0]), 1);

    yield* all(
        rectRef1().width(550, 1),
        rectRef1().height(150, 1),
        codeRef1().edit(1)`
let rotation = [
    ${edit("0", "(index * 2 * Math.PI) / images.length")}, 
    ${edit("(index * 2 * Math.PI) / images.length", "0")}, 
    0
];`,
        sequence(
            0.2,
            ...orbitImages.planes.map((plane, i) =>
                tween(0.5, (value) => {
                    plane.rotation.y = easeInOutCubic(
                        value,
                        calculatePosition(i, orbitImages.planes.length),
                        0
                    );
                    plane.rotation.x = easeInOutCubic(
                        value,
                        Math.PI,
                        calculatePosition(i, orbitImages.planes.length)
                    );
                })
            )
        )
    );

    yield* waitFor(2);

    yield* all(
        codeRef1().edit(1)`
let rotation = [
    ${edit("(index * 2 * Math.PI) / images.length", "0")},
    0,
    ${edit("0", "(index * 2 * Math.PI) / images.length")}
];`,
        sequence(
            0.2,
            ...orbitImages.planes.map((plane, i) =>
                tween(0.5, (value) => {
                    plane.rotation.x = easeInOutCubic(
                        value,
                        calculatePosition(i, orbitImages.planes.length),
                        0
                    );
                    plane.rotation.z = easeInOutCubic(
                        value,
                        0,
                        calculatePosition(i, orbitImages.planes.length)
                    );
                })
            )
        )
    );

    yield* waitFor(10);

    yield* all(
        codeRef1().edit(1)`
let rotation = [
    ${edit("0", "(index * 2 * Math.PI) / images.length")}
    0,
    ${edit("(index * 2 * Math.PI) / images.length", "0")},
];`,
        sequence(
            0.2,
            ...orbitImages.planes.map((plane, i) =>
                tween(0.5, (value) => {
                    plane.rotation.z = easeInOutCubic(
                        value,
                        calculatePosition(i, orbitImages.planes.length),
                        0
                    );
                    plane.rotation.y = easeInOutCubic(
                        value,
                        0,
                        calculatePosition(i, orbitImages.planes.length)
                    );
                })
            )
        )
    );

    yield* waitUntil("scrolling");

    yield* all(
        layout().x(-previewSize.add(160).width, 1),
        three().x(0, 1),
        three().scale(2, 1)
    );

    yield* tween(5, (value) => {
        orbitImages.planeGroup.rotation.set(
            0,
            easeInOutCubic(value, Math.PI, Math.PI * 2 * 3),
            0
        );
    });

    waitFor(5);

    yield* all(layout().x(0, 1), three().x(400, 1), three().scale(1, 1));

    yield* all(
        rectRef1().size([800, 275], 0.5),
        codeRef1().edit(1)`
        ${edit(
            `let rotation = [
    (index * 2 * Math.PI) / images.length,
    0,
    0,
];`,
            `<ScrollControls
    enabled={cameraTapped}
    pages={images.length}
    infinite
    horizontal={width > 1000 && height > 1000 ? false : true}
>
    <Rig rotation={[0, 0, 0.05]}>
        <Carousel />
    </Rig>
</ScrollControls>`
        )}`
    );

    yield* waitUntil("getStarted");

    yield* codeRef1().selection([...lines(0, 5), ...lines(9, 9)], 1);

    yield* waitFor(4);

    yield* all(
        codeRef1().selection(lines(2, 2), 1),
        tween(5, (value) => {
            orbitImages.planeGroup.rotation.set(
                0,
                easeInOutQuad(value, Math.PI * 2 * 3, Math.PI * 2),
                0
            );
        })
    );

    yield* waitUntil("useScroll");

    yield* all(
        rectRef1().size([650, 200], 1),
        three().position.x(previewSize.add(160).width, 1),
        layout().position.x(500, 1),
        codeRef1().edit(1)`
        ${edit(
            `<ScrollControls
    enabled={cameraTapped}
    pages={images.length}
    infinite
    horizontal={width > 1000 && height > 1000 ? false : true}
>
    <Rig rotation={[0, 0, 0.05]}>
        <Carousel />
    </Rig>
</ScrollControls>`,
            `const scroll = useScroll();

useFrame((state, delta) => {
    const offset = scroll.offset;

    categoryRef.current.rotation.y = offset * 50;
});`
        )}
        `
    );

    yield* waitUntil("achieve");

    yield* codeRef1().selection(lines(5, 5), 1);
    yield* codeRef1().edit(1)`${remove(`const scroll = useScroll();

    useFrame((state, delta) => {
        const offset = scroll.offset;
    
        categoryRef.current.rotation.y = offset * 50;
    });`)}`;
    // yield* layout().position.x(previewSize.add(160).width, 1);

    yield* waitUntil("didn't");

    // yield* all(three().position.x(0, 1), three().scale(2, 1));

    yield* waitUntil("if");
    yield* sequence(
        0.3,
        rectRef1().size([950, 730], 0.5),

        codeRef1().edit(0.5)`
    void main() {
        float sine = sin(PI * uProgress);
        float waves = sine * 8.0 * sin(50.0 * length(uv) + 15.0 * uProgress);
        vUv = uv;
        vec3 pos = position;
    
        if (roundMedia == 1.0) {
            pos.z += sin(PI * vUv.x) * 0.1;
        }
    
        vec4 defaultState = modelMatrix * vec4(pos, 1.0);
        vec4 endState = vec4(pos, 1.0);
    
        endState.x *= uResolution.x;
        endState.y *= uResolution.y;
        endState.z += uCorners.x;
    
        float cornersProgress = mix(
            mix(uCorners.x, uCorners.y, waves),
            mix(uCorners.z, uCorners.w, waves),
            uv.y
        );
    
        vec4 finalState = mix(defaultState, endState, cornersProgress);
    
        vSize = mix(uQuadSize, uResolution, cornersProgress);
    
        gl_Position = projectionMatrix * viewMatrix * finalState;
    }`
    );

    yield* codeRef1().selection(lines(6, 9), 0.3);
    yield* waitFor(3);
    yield* codeRef1().edit(0.5, false)`
    void main() {
        float sine = sin(PI * uProgress);
        float waves = sine * 8.0 * sin(50.0 * length(uv) + 15.0 * uProgress);
        vUv = uv;
        vec3 pos = position;
    
        ${remove("if (roundMedia == 1.0) {")}
            pos.z += sin(PI * vUv.x) * 0.1;
        ${remove("}")}
    
        vec4 defaultState = modelMatrix * vec4(pos, 1.0);
        vec4 endState = vec4(pos, 1.0);
    
        endState.x *= uResolution.x;
        endState.y *= uResolution.y;
        endState.z += uCorners.x;
    
        float cornersProgress = mix(
            mix(uCorners.x, uCorners.y, waves),
            mix(uCorners.z, uCorners.w, waves),
            uv.y
        );
    
        vec4 finalState = mix(defaultState, endState, cornersProgress);
    
        vSize = mix(uQuadSize, uResolution, cornersProgress);
    
        gl_Position = projectionMatrix * viewMatrix * finalState;
    }`;

    yield* codeRef1().selection(lines(7, 7), 0.3);

    // yield* waitFor(4);

    // const orbitImgs = createRef<OrbitImages>();
    // const layout = createRef<Layout>();
    // const textRef = createRef<Txt>();

    // view.add(
    //     <Layout ref={layout}>
    //         <Txt
    //             {...WhiteLabel}
    //             text={"Imagine a top down view of the images"}
    //             scale={0}
    //             ref={textRef}
    //             y={-previewSize.y / 2 + 40}
    //         />
    //         <OrbitImages ref={orbitImgs} displayImages={false} />
    //     </Layout>
    // );

    // orbitImgs().imageCount(5);

    // yield* all(
    //     ...orbitImgs().rects.map((rect, i) => rect.image.height(10, 0.3))
    // );

    // yield* textRef().scale(2, 0.5);

    // yield* all(
    //     sequence(
    //         0.1,
    //         ...orbitImgs().rects.map((rect, i) =>
    //             rect.position(
    //                 [orbitImgs().calcXPos(i), orbitImgs().calcYPos(i)],
    //                 0.5
    //             )
    //         )
    //     )
    // );

    yield* waitFor(10);
});

const calculatePosition = (i: number, length: number) => {
    return (i * 2 * Math.PI) / length;
};

function calcXPos(i: number, length: number): number {
    return Math.sin(calculatePosition(i, length)) * 2;
}
function calcZPos(i: number, length: number): number {
    return Math.cos(calculatePosition(i, length)) * 2;
}

function calcRotation(i: number): number {
    const x = this.calcXPos(i);
    const y = this.calcYPos(i);

    let angle = Math.atan2(y, x);
    angle -= Math.PI / 2;

    return angle; // Return the angle in radians
}

function codeRect(
    previewSize: Vector2,
    grow?: number,
    code?: string
): [Reference<CodeBlock>, Reference<Rect>, Node] {
    const codeRef = createRef<CodeBlock>();
    const rectRef = createRef<Rect>();

    const rect = (
        <Rect
            grow={grow}
            ref={rectRef}
            // stroke={Colors.TERTIARY}
            // lineWidth={3}
            padding={20}
            radius={15}
            fill={"#242424"}
        >
            <CodeBlock
                width={previewSize.width / 2}
                opacity={0}
                ref={codeRef}
                fontSize={20}
                language="tsx"
                code={code}
            />
        </Rect>
    );
    return [codeRef, rectRef, rect];
}
