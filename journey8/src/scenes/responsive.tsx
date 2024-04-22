import {
    Grid,
    Icon,
    Img,
    Line,
    Node,
    Rect,
    Txt,
    makeScene2D,
    vector2Signal,
} from "@motion-canvas/2d";
import { BlackLabel, Colors, WhiteLabel } from "../../styles";
import {
    DEFAULT,
    Direction,
    SignalValue,
    Vector2,
    all,
    chain,
    createRef,
    createSignal,
    easeInCubic,
    easeInOutCubic,
    easeInOutSine,
    easeOutCubic,
    linear,
    sequence,
    slideTransition,
    tween,
    useScene,
    waitFor,
    waitUntil,
} from "@motion-canvas/core";
import * as camera from "../three/camera";
import { Three } from "../components/Three";
import githubIssue from "../images/responsive.png";
import {
    CodeBlock,
    edit,
    insert,
    lines,
    remove,
} from "@motion-canvas/2d/lib/components/CodeBlock";

export default makeScene2D(function* (view) {
    const previewSize = view.size().sub(160);
    const background = createRef<Rect>();
    const three = createRef<Three>();
    const githubRef = createRef<Img>();
    const dimensionsTxt = createRef<Txt>();
    const codeBackground = createRef<Rect>();
    const codeRef = createRef<CodeBlock>();
    const txtGroup = createRef<Node>();
    const grid = createRef<Grid>();
    const navi = createRef<Node>();
    const point = createRef<Rect>();
    const sizeText = createRef<Node>();
    const calcText = createRef<CodeBlock>();
    const gridGroup = createRef<Node>();

    const orbitX = createSignal(0);
    const orbitY = createSignal(0);

    const posX = createSignal(0);
    const posY = createSignal(0);
    const scale = createSignal(0);

    const rotX = createSignal(0);
    const rotY = createSignal(-Math.PI / 2);

    yield* slideTransition(Direction.Right);

    const backgroundSize = createSignal(previewSize.add(160));

    const scaleText = dimensionText("model scale: ", () => scale().toFixed(1));

    const coordText1 = dimensionText("x position: ", () => posX().toFixed(1));
    const coordText2 = dimensionText("y position: ", () => posY().toFixed(1));

    const widthText = dimensionText("width: ", () =>
        backgroundSize().x.toFixed(0)
    );
    const heightText = dimensionText("height: ", () =>
        backgroundSize().y.toFixed(0)
    );

    const xLine = createSignal([Vector2.zero, Vector2.right]);
    const yLine = createSignal([Vector2.zero, Vector2.down]);

    const pointCoords = createSignal(Vector2.zero);

    view.add(
        <Rect ref={background} size={backgroundSize}>
            <Three
                ref={three}
                quality={2}
                width={1920}
                height={1080}
                zoom={100}
                scene={camera.threeScene}
                camera={camera.camera}
            />
            <Node ref={txtGroup} opacity={0}>
                <Txt
                    {...BlackLabel}
                    fontSize={50}
                    y={-previewSize.height / 2}
                    text="Responsiveness"
                />
                <Rect
                    layout
                    ref={dimensionsTxt}
                    direction={"column"}
                    y={() => 0}
                    x={() => -backgroundSize().x / 2 + 400}
                    fill={Colors.background}
                    padding={40}
                    radius={15}
                >
                    <Txt
                        {...WhiteLabel}
                        fontSize={35}
                        text={"Dimensions"}
                        marginBottom={30}
                    />
                    <Rect layout direction={"column"} gap={40}>
                        {scaleText}
                        <Rect direction={"column"}>
                            {coordText1}
                            {coordText2}
                        </Rect>

                        <Rect direction={"column"}>
                            {widthText}
                            {heightText}
                        </Rect>
                    </Rect>
                </Rect>
            </Node>
            <Img src={githubIssue} ref={githubRef} opacity={0} />
            <Rect
                opacity={0}
                padding={20}
                radius={15}
                fill={"#242424"}
                layout
                ref={codeBackground}
            >
                <CodeBlock
                    ref={codeRef}
                    width={previewSize.width / 2}
                    fontSize={20}
                    language="tsx"
                    code={`<div
    onClick={() => {
        setPosition([19, 8, 0]);
        setScale(20);
        navigate("/camera2");
    }}
>
    about
</div>`}
                />
            </Rect>
            <Node ref={gridGroup}>
                <Grid
                    ref={grid}
                    size={backgroundSize}
                    // spacing={() => scale() * 60}
                    stroke={"#444"}
                    lineWidth={1}
                    lineCap="square"
                    start={0}
                    end={0}
                />
                <Node ref={navi} opacity={0}>
                    <Node>
                        <Line
                            stroke={Colors.red}
                            lineWidth={4}
                            endArrow
                            arrowSize={10}
                            points={xLine}
                        />
                        <Txt
                            {...WhiteLabel}
                            fill={Colors.red}
                            text="X"
                            x={() => xLine()[1].x + 10}
                            y={50}
                        />
                    </Node>
                    <Node>
                        <Line
                            stroke={Colors.green}
                            lineWidth={4}
                            endArrow
                            arrowSize={10}
                            // points={[Vector2.zero, Vector2.down.scale(250)]}
                            points={yLine}
                        />
                        <Txt
                            {...WhiteLabel}
                            fill={Colors.green}
                            text="Y"
                            x={-50}
                            y={() => yLine()[1].y + 10}
                        />
                    </Node>
                </Node>
                <Rect ref={point} opacity={0} position={pointCoords}>
                    <Txt
                        {...WhiteLabel}
                        text={() =>
                            `${(pointCoords().x / 100).toFixed(1)}, ${(
                                pointCoords().y / 100
                            ).toFixed(1)}`
                        }
                        x={-80}
                    />
                    <Icon icon={"tabler:point-filled"} scale={3} />
                </Rect>
                <Node
                    ref={sizeText}
                    opacity={0}
                    position={() => [
                        backgroundSize().sub(160).x / 2 - 50,
                        -backgroundSize().sub(160).y / 2,
                    ]}
                >
                    <Txt
                        {...WhiteLabel}
                        fontSize={15}
                        text={"using simplified values"}
                        y={-50}
                    />
                    <Txt
                        {...WhiteLabel}
                        text={() =>
                            `${(backgroundSize().x / 100).toFixed(1)} x ${(
                                backgroundSize().y / 100
                            ).toFixed(1)}`
                        }
                    />
                </Node>
            </Node>
            <CodeBlock
                ref={calcText}
                opacity={0}
                // {...WhiteLabel}
                fontSize={30}
                y={() => backgroundSize().sub(160).y / 2 - 100}
                code={`
                x = viewport.width / 2;
                y = -viewport.height / 2;`}
            />
        </Rect>
    );

    useScene().lifecycleEvents.onBeginRender.subscribe(() => {
        camera.orbit.rotation.set(orbitX(), orbitY(), 0, "XYZ");
        camera.cameraModel.position.set(posX(), posY(), 0);
        camera.cameraModel.scale.setScalar(scale());
        camera.cameraModel.rotation.set(rotX(), rotY(), 0, "XYZ");
    });

    yield* all(background().fill("#f9f4ef", 1), scale(1, 1));
    yield* txtGroup().opacity(1, 1);

    yield* waitFor(3);
    yield* all(posX(5, 1), posY(2, 1), dimensionsTxt().position.x(0, 1));

    yield* waitFor(2);
    yield* all(posY(-2, 1));

    yield* waitFor(2);
    yield* all(posX(-5, 1));

    yield* waitUntil("size");

    yield* all(
        backgroundSize(previewSize.sub(250), 1),
        posX(-8, 1),
        posY(0, 1)
    );

    yield* waitFor(2);

    yield* all(
        backgroundSize(
            new Vector2(
                previewSize.sub(250).width / 2,
                previewSize.sub(250).height
            ),
            1
        ),
        posX(-11, 1)
    );

    yield* waitFor(2);

    yield* all(
        backgroundSize(previewSize.add(160), 1),
        posX(0, 1),
        dimensionsTxt().position.x(() => -backgroundSize().x / 2 + 400, 1)
    );

    yield* waitUntil("issues");

    yield* all(
        githubRef().opacity(1, 1),
        githubRef().scale(1.2, 1),
        githubRef().position.x(200, 1),
        githubRef().position.y(300, 1)
    );

    yield* sequence(
        2.5,
        githubRef().position.y(-100, 5, easeInOutSine),
        githubRef().scale(1.4, 5, easeInOutSine)
    );

    yield* waitFor(3);

    yield* all(
        githubRef().opacity(0, 0.5),
        githubRef().scale(0, 1),
        githubRef().position(0, 1)
    );

    yield* waitUntil("manually");

    yield* all(
        codeBackground().opacity(1, 1),
        three().opacity(0, 1),
        txtGroup().opacity(0, 1)
    );

    yield* waitFor(2);

    yield* codeRef().selection(lines(2, 5), 1);

    yield* waitFor(5);

    yield* codeBackground().opacity(0, 1);

    yield* waitUntil("example");

    yield* all(three().opacity(1, 1), txtGroup().opacity(1, 1));
    yield* scale(0.3, 1);

    yield* waitFor(2);

    yield* all(posX(7, 1), posY(3, 1), rotY(-Math.PI * 0.8, 1));

    yield* waitFor(5);

    yield* all(scale(4, 1), posX(0, 1), posY(0, 1), rotY(-Math.PI / 2, 1));

    yield* waitFor(3);

    yield* scale(1, 1);

    yield* waitUntil("fly");

    yield* all(
        backgroundSize(
            new Vector2(
                previewSize.sub(250).width / 2,
                previewSize.add(160).height
            ),
            1
        ),
        rotY(Math.PI, 1),
        posX(-11, 1)
    );

    yield* waitFor(3);

    yield* all(
        backgroundSize(previewSize.add(160), 1),
        rotY(-Math.PI / 2, 1),
        posX(0, 1)
    );

    // yield* waitFor(2);
    yield* codeRef().edit(0)`
    const { viewport, size } = useThree((state) => state);`;
    yield* codeRef().selection(DEFAULT, 0);

    yield* all(
        codeBackground().opacity(1, 1),
        three().opacity(0, 1),
        txtGroup().opacity(0, 1)
    );

    yield* waitFor(3);

    yield* all(
        codeBackground().opacity(0, 1),
        background().fill(Colors.background, 1),
        navi().opacity(1, 1)
    );

    yield* sequence(
        0.5,
        all(grid().end(0.5, 0.3).to(1, 1), grid().start(0.5, 0.3).to(0, 1)),
        all(
            xLine([Vector2.zero, Vector2.right.scale(250)], 1),
            yLine([Vector2.zero, Vector2.down.scale(250)], 1)
        )
    );

    yield* point().opacity(1, 1);

    yield* waitFor(2);

    yield* sizeText().opacity(1, 1);

    yield* waitUntil("divide");

    // yield* pointCoords(Vector2.right.scale(250), 1);

    yield* pointCoords(
        () =>
            new Vector2(
                backgroundSize().sub(160).width / 2 - 100,
                -backgroundSize().sub(160).height / 2 + 100
            ),
        1
    );
    yield* all(calcText().opacity(1, 1));

    yield* waitFor(2);

    yield* calcText().edit(1)`
x = viewport.width / 2${insert(" - 50")};
y = -viewport.height / 2;`;

    yield* waitFor(2);

    yield* pointCoords(
        () =>
            new Vector2(
                backgroundSize().sub(160).width / 2 - 150,
                -backgroundSize().sub(160).height / 2 + 100
            ),
        1
    );

    yield* waitUntil("mobile");

    yield* all(
        backgroundSize(
            new Vector2(previewSize.width / 3, previewSize.height),
            1
        ),
        gridGroup().position.x(previewSize.width / 2 - 400, 1),
        calcText().position(new Vector2(-previewSize.width / 2 + 400, 0), 1)
    );

    yield* waitFor(2);

    yield* calcText().edit(1)`
${insert("if(size.width > 1000 && size.height > 700) {")} 
${insert("    ")}x = viewport.width / 2 ${edit("- 50", "+ 100")};
${insert("    ")}y = -viewport.height / 2;
${insert("}")}`;

    yield* pointCoords(
        () =>
            new Vector2(
                backgroundSize().sub(160).width / 2,
                -backgroundSize().sub(160).height / 2 + 100
            ),
        1
    );

    yield* waitFor(5);

    yield* pointCoords(
        () =>
            new Vector2(
                backgroundSize().width - backgroundSize().width,
                -backgroundSize().sub(160).height / 2
            ),
        1
    );

    yield* waitFor(3);

    yield* calcText().edit(1)`
if(size.width > 1000 && size.height > 700) {
    x = ${edit(`viewport.width / 2 + 100`, `0`)};
    y = -viewport.height / 2;
}`;

    yield* waitFor(2);

    yield* calcText().selection(lines(1, 2), 1);

    yield* waitUntil("screens");

    yield* all(
        calcText().opacity(0, 1),
        backgroundSize(new Vector2(previewSize.width, previewSize.height), 1),
        gridGroup().position.x(0, 1)
    );

    yield* pointCoords(
        () =>
            new Vector2(
                -backgroundSize().width / 2 + 200,
                -backgroundSize().sub(160).height / 2
            ),
        1
    );

    yield* all(
        backgroundSize(
            new Vector2(previewSize.width / 4, previewSize.height / 2),
            1
        ).to(new Vector2(previewSize.width / 2, previewSize.height / 3), 1),

        pointCoords(
            () =>
                new Vector2(
                    -backgroundSize().width / 2,
                    backgroundSize().sub(160).height / 2
                ),
            1
        ).to(() => new Vector2(0, 0), 1)
    );

    yield* waitFor(30);
});

function dimensionText(des: string, value: SignalValue<string>): Node {
    return (
        <Rect layout gap={10}>
            <Txt {...WhiteLabel} text={des} />
            <Txt {...WhiteLabel} text={value} fill={Colors.HIGHLIGHT} />
        </Rect>
    );
}
