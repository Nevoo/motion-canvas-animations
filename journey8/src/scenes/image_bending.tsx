import { Rect, Txt, makeScene2D } from "@motion-canvas/2d";
import {
    DEFAULT,
    all,
    chain,
    createRef,
    createSignal,
    makeRef,
    range,
    sequence,
    waitFor,
    waitUntil,
} from "@motion-canvas/core";
import {
    CodeBlock,
    edit,
    insert,
    lines,
    remove,
    word,
} from "@motion-canvas/2d/lib/components/CodeBlock";
import { applyViewStyles, Colors, BaseFont, BlackLabel } from "../../styles";
import { ImageCard } from "../components/orbit-images";

export default makeScene2D(function* (view) {
    // let rectLength = createSignal(1);
    applyViewStyles(view);
    const rects: Rect[] = [];
    const txts: Txt[] = [];
    const codeRef = createRef<CodeBlock>();

    view.add(
        range(1).map((i) => (
            <Rect
                ref={makeRef(rects, i)}
                x={0}
                scale={0}
                width={200}
                height={200}
                fill={Colors.MAIN}
                radius={8}
            />
        ))
    );

    yield* rects[0].scale(1, 1);
    yield* waitUntil("event");

    yield view.add(
        range(6).map((i) => (
            <Rect
                ref={makeRef(rects, i + 1)}
                x={-225 + 125 * i + 1}
                scale={0}
                width={100}
                height={100}
                fill={Colors.SECONDARY}
                radius={8}
            />
        ))
    );

    yield* all(
        rects[0].size(100, 1),
        rects[0].position.x(-350, 1),
        sequence(0.15, ...rects.reverse().map((rect) => rect.scale(1, 1)))
    );

    yield* all(
        ...rects.map((rect, i) =>
            rect.position(
                [calcXPos(i, rects.length), calcYPos(i, rects.length)],
                1
            )
        )
    );

    yield* all(
        ...rects.map((rect, i) =>
            rect.position.x(calcXPos(i, rects.length) + 500, 1)
        )
    );

    yield view.add(
        <CodeBlock
            opacity={0}
            ref={codeRef}
            fontSize={26}
            x={-400}
            language="tsx"
            code={`
            <Card
                key={index}
                url={imageData.image}
                title={imageData.title}
                style={style}
            />
            `}
        />
    );

    yield* all(
        codeRef().opacity(1, 1),
        codeRef().edit(1)`
            <Card
                key={index}
                url={imageData.image}
                title={imageData.title}
                ${insert(`
                position={[
                    Math.sin((index / count) * Math.PI * 2) * radius,
                    0,
                    Math.cos((index / count) * Math.PI * 2) * radius,
                ]}`)}
                style={style}
            />
    `
    );

    rects.forEach((rect, i) =>
        rect.insert(
            <Txt
                {...BlackLabel}
                text={i.toString()}
                scale={0}
                ref={makeRef(txts, i)}
                fill={"#00214d"}
            />
        )
    );

    yield* sequence(0.3, ...txts.map((txt, i) => txt.scale(1, 1)));

    yield* waitFor(1);

    yield* sequence(0.3, ...txts.map((txt, i) => txt.scale(0, 1)));

    rects.forEach((rect, i) => rect.removeChildren());

    yield* waitUntil("event2");

    yield* all(
        ...rects.map((rect, i) =>
            all(
                rect.rotation(
                    calcRotation(i, rects.length) * (180 / Math.PI),
                    1
                ),
                rect.size([100, 10], 1)
            )
        )
    );

    yield* waitUntil("event3");

    yield* all(
        ...rects.map((rect, i) =>
            all(
                rect.rotation(
                    calcRotation(i + 1, rects.length) * (180 / Math.PI),
                    1
                ),
                rect.position(
                    [
                        calcXPos(i + 1, rects.length) + 500,
                        calcYPos(i + 1, rects.length),
                    ],
                    1
                )
            )
        )
    );
});

function calcXPos(i: number, length: number) {
    return Math.sin((i / length) * Math.PI * 2) * 200;
}

function calcYPos(i: number, length: number) {
    return Math.cos((i / length) * Math.PI * 2) * 200;
}

function calcRotation(i: number, length: number) {
    const x = calcXPos(i, length);
    const y = calcYPos(i, length);

    let angle = Math.atan2(y, x);
    angle -= Math.PI / 2;

    return angle; // Return the angle in radians
}
