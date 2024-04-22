import { Layout, Node, Rect, makeScene2D } from "@motion-canvas/2d";
import {
    CodeBlock,
    edit,
    insert,
    lines,
    word,
} from "@motion-canvas/2d/lib/components/CodeBlock";
import {
    DEFAULT,
    Direction,
    Reference,
    Vector2,
    all,
    createRef,
    slideTransition,
    waitFor,
    waitUntil,
} from "@motion-canvas/core";
import { Colors } from "../../styles";

export default makeScene2D(function* (view) {
    const backgroundSize = view.size();
    const previewSize = backgroundSize.sub(160);

    const background = createRef<Rect>();
    const layout = createRef<Layout>();
    const node = createRef<Node>();

    const [codeRef, rectRef, rect] = codeRect(
        previewSize,
        1,
        `import { create } from "zustand";

export default useImageState;`
    );

    const [codeRef2, rectRef2, rect2] = codeRect(
        previewSize,
        1,
        `export const Card = ({ style, position, url, ...props }) => {
    
    ...

    const AnimatedImage = animated(Image);

    return (
        <group>
            <AnimatedImage
                ref={ref}
                url={url}
                transparent
                side={THREE.DoubleSide}
                onPointerOver={pointerOver}
                onPointerOut={pointerOut}
                position={style.positionOffset.to((offset) => [
                    position[0],
                    position[1] + offset,
                    position[2] + offset,
                ])}
                {...props}
            >
                <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
            </AnimatedImage>
        </group>
    );
};`
    );

    yield* rectRef2().opacity(0, 0);

    view.add(
        <Rect ref={background} size={backgroundSize} fill={Colors.TERTIARY}>
            <Layout ref={layout}>
                {rect}
                {/* <Node ref={node} scale={0}> */}
                {rect2}
                {/* </Node> */}
            </Layout>
        </Rect>
    );

    yield* slideTransition(Direction.Right);

    yield* waitUntil("break");

    yield* codeRef().opacity(1, 1);

    yield* codeRef().edit(1)`
import { create } from "zustand";
${insert(`

const useImageState = create((set) => ());
`)}
export default useImageState;`;

    yield* waitFor(4);

    yield* codeRef().edit(1)`
import { create } from "zustand";

${edit(
    "const useImageState = create((set) => ());",
    `const useImageState = create((set) => ({
    cameraTapped: false,
    tapCamera: (isTapped) => set({ cameraTapped: isTapped }),
}));`
)}

export default useImageState;`;

    yield* waitFor(4);

    yield* codeRef().edit(1)`
    ${edit(
        `import { create } from "zustand";

const useImageState = create((set) => ({
    cameraTapped: false,
    tapCamera: (isTapped) => set({ cameraTapped: isTapped }),
}));

export default useImageState;`,
        `const LandingPage = () => {
    const tapCamera = useImageState((state) => state.tapCamera);

    return (
        <group>
            <CameraView
                displayRig
                isFloating={true}
                onCameraTap={(e) => {
                    e.stopPropagation();
                    tapCamera(true);
                }}
            >
                <OptimzedOrbitImages />
                <EffectComposer disableNormalPass>
                    <N8AO aoRadius={0.1} intensity={1} />
                </EffectComposer>
            </CameraView>
        </group>
    );
};`
    )}`;

    yield* codeRef().selection(lines(1, 1), 1);

    yield* waitFor(3);

    yield* codeRef().selection([...lines(1, 1), ...lines(8, 11)], 1);
    yield* codeRef().edit(1)`${edit(
        `const LandingPage = () => {
        const tapCamera = useImageState((state) => state.tapCamera);
    
        return (
            <group>
                <CameraView
                    displayRig
                    isFloating={true}
                    onCameraTap={(e) => {
                        e.stopPropagation();
                        tapCamera(true);
                    }}
                >
                    <OptimzedOrbitImages />
                    <EffectComposer disableNormalPass>
                        <N8AO aoRadius={0.1} intensity={1} />
                    </EffectComposer>
                </CameraView>
            </group>
        );
    };`,
        "e"
    )}`;

    yield* background().fill(Colors.background, 1);

    yield* codeRef().edit(1)`
const trail = useTrail(images.length, {
    config: {
        mass: 5,
        friction: 200,
        tension: 2000,
    },
    positionOffset: cameraTapped ? 0 : 100,
    rotationOffset: cameraTapped ? 0 : 15,
    scale: cameraTapped ? 5 : 0,
    fontScale: cameraTapped ? 1 : 0,
    from: {
        positionOffset: 100,
        rotationOffset: 15,
        scale: 0,
        fontScale: 0,
    },
    onRest: (value, _, __) => {
        if (value.finished && tappedImage !== null) {
            navigate(routes.gallery.replace(":id", tappedImage));
        }
    },
});`;

    yield* codeRef().selection(DEFAULT, 1);

    yield* waitUntil("useTrail");

    yield* codeRef().selection(word(0, 23, 13), 1);
    yield* waitFor(1);

    yield* codeRef().selection(lines(1, 15), 1);
    yield* waitFor(2);

    yield* codeRef().selection([...lines(6, 6), ...lines(11, 11)], 1);

    yield* waitFor(10);

    yield* codeRef().edit(1)`
    ${edit(
        `const trail = useTrail(images.length, {
    config: {
        mass: 5,
        friction: 200,
        tension: 2000,
    },
    positionOffset: cameraTapped ? 0 : 100,
    rotationOffset: cameraTapped ? 0 : 15,
    scale: cameraTapped ? 5 : 0,
    fontScale: cameraTapped ? 1 : 0,
    from: {
        positionOffset: 100,
        rotationOffset: 15,
        scale: 0,
        fontScale: 0,
    },
    onRest: (value, _, __) => {
        if (value.finished && tappedImage !== null) {
            navigate(routes.gallery.replace(":id", tappedImage));
        }
    },
});`,
        `return trail.map(({ ...style }, index) => {
    const imageData = categories[index];

    return (
        <Card
            onPointerUp={(e) => {
                e.stopPropagation();
                setTappedImage(index);
                tapCamera(false);
                setGalleryOpen(true);
            }}
            key={index}
            url={imageData.image}
            title={imageData.title}
            position={[
                Math.sin((index / count) * Math.PI * 2) * radius,
                0,
                Math.cos((index / count) * Math.PI * 2) * radius,
            ]}
            rotation={[0, Math.PI + (index / count) * Math.PI * 2, 0]}
            style={style}
        />
    );
});`
    )}`;

    yield codeRef().selection(lines(0, 0), 1);

    yield* waitFor(6);

    yield codeRef().selection(lines(14, 18), 1);

    yield* waitFor(2);

    yield* all(
        codeRef2().opacity(1, 1),
        codeRef2().selection(lines(15, 19), 1),
        rectRef2().opacity(1, 1),
        rectRef2().x(previewSize.width / 2 - 500, 1),
        rectRef().scale(0.5, 1),
        rectRef().x(-previewSize.width / 2 + 250, 1)
    );

    yield* waitFor(3);

    yield* all(
        rectRef2().x(-previewSize.width / 4 + 450, 1),
        rectRef().opacity(0, 1)
    );

    yield* waitFor(3);

    yield* codeRef2().edit(1)`${edit(
        `export const Card = ({ style, position, url, ...props }) => {

    ...

    const AnimatedImage = animated(Image);

    return (
        <group>
            <AnimatedImage
                ref={ref}
                url={url}
                transparent
                side={THREE.DoubleSide}
                onPointerOver={pointerOver}
                onPointerOut={pointerOut}
                position={style.positionOffset.to((offset) => [
                    position[0],
                    position[1] + offset,
                    position[2] + offset,
                ])}
                {...props}
            >
                <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
            </AnimatedImage>
        </group>
    );
};`,
        `export const CategoryTitle = ({
    hovered,
    title,
    position,
    rotation,
    scale,
    offset,
}) => {
    const { fontSize, color } = useSpring({
        fontSize: hovered ? 0.7 : 0.6,
        color: hovered ? "#078080" : "#232323",
        config: config.wobbly,
    });

    const AnimatedText = animated(Text);

    return (
        <AnimatedText
            scale={scale}
            fontSize={fontSize}
            font={suspend(gilroy).default}
            color={color}
            position={[position[0], position[1] - offset ?? 3, position[2]]}
            rotation={rotation}
        >
            {title}
        </AnimatedText>
    );
};`
    )}`;

    // yield* all(rectRef().layout(null, 1), layout().layout(true, 1));

    yield* waitFor(5);
    yield* codeRef2().selection(lines(13, 28), 1);

    yield* waitFor(2);
    yield* codeRef2().selection(lines(22, 22), 1);

    yield* waitFor(8);
    yield* codeRef2().selection(lines(8, 13), 1);

    yield* waitFor(10);
    // yield* waitUntil("responsive");
});

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
            padding={20}
            radius={15}
            fill={"#242424"}
            layout
        >
            <CodeBlock
                opacity={0}
                ref={codeRef}
                fontSize={26}
                language="tsx"
                code={code}
            />
        </Rect>
    );
    return [codeRef, rectRef, rect];
}
