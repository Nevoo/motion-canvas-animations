import {
    Img,
    Knot,
    Layout,
    Node,
    Rect,
    Spline,
    Txt,
    colorSignal,
    makeScene2D,
} from "@motion-canvas/2d";
import { Colors, WhiteLabel } from "../../styles";
import {
    Center,
    PossibleVector2,
    Reference,
    all,
    createRef,
    createSignal,
    easeInCubic,
    linear,
    makeRef,
    sequence,
    waitFor,
    waitUntil,
} from "@motion-canvas/core";

import image from "../images/fullscreen.jpeg";
import { OrbitImages } from "../components/orbit-images";

const todos = {
    task1: "Texture loading and adding a border radius",
    task2: "Calculate the position dynamically",
    task3: "Calculate the rotation dynamically",
    task4: "Making the carousel scrollable",
    task5: "Achieving the bending effect",
};

export default makeScene2D(function* (view) {
    const rect = createRef<Rect>();

    const headline = createRef<Txt>();
    const imgNode = createRef<Node>();
    const img = createRef<Img>();
    const orbitImgs = createRef<OrbitImages>();

    const previewSize = view.size().sub(160);

    yield* waitUntil("work split");

    yield view.add(
        <Layout size={previewSize}>
            <Txt
                position={[0, -450]}
                {...WhiteLabel}
                textAlign={"center"}
                fontSize={40}
                ref={headline}
            />

            <Node ref={imgNode}>
                <Rect ref={rect} fill={Colors.MAIN} position={[0, 50]} />
            </Node>
        </Layout>
    );

    yield* all(headline().text(todos.task1, 1), rect().size([500, 500], 1));

    yield imgNode().add(
        <Img
            ref={img}
            src={image}
            width={500}
            height={500}
            position={[0, 50]}
            opacity={0}
        />
    );

    yield* replaceRectWithImage(rect, img);
    yield* waitFor(1);
    yield* img().radius(50, 1);
    yield* waitUntil("task1");
    yield* all(headline().text(todos.task2, 1), sequence(1, img().scale(0, 1)));
    yield imgNode().remove();

    // Orbit Images
    view.add(<OrbitImages ref={orbitImgs} />);
    yield* orbitImgs().imageCount(7, 0.3, linear);
    yield* all(
        sequence(0.1, ...orbitImgs().rects.map((rect) => rect.scale(1, 1)))
    );
    yield* all(
        ...orbitImgs().rects.map((rect, i) =>
            rect.position([orbitImgs().calcXPos(i), orbitImgs().calcYPos(i)], 1)
        )
    );

    yield* orbitImgs().imageCount(8, 0.3);
    yield* all(
        ...orbitImgs().rects.map((rect, i) =>
            rect.position([orbitImgs().calcXPos(i), orbitImgs().calcYPos(i)], 1)
        ),
        ...orbitImgs().rects.map((rect) => rect.scale(1, 1))
    );
    // END

    yield* waitUntil("task2");
    yield* headline().text("", 0.5);
    yield* headline().text(todos.task3, 0.5);

    // yield* all(
    //     ...orbitImgs().rects.map((rect, i) => all(rect.size([100, 10], 1)))
    // );

    yield* all(
        ...orbitImgs().rects.map((rect, i) =>
            all(rect.rotation(orbitImgs().calcRotation(i) * (180 / Math.PI), 1))
        )
    );

    // yield* waitUntil("task3");
    yield* all(
        headline().text(todos.task4, 1),
        ...orbitImgs().rects.map((rect, i) =>
            all(
                rect.rotation(
                    orbitImgs().calcRotation(i + 1) * (180 / Math.PI),
                    1
                ),
                rect.position(
                    [orbitImgs().calcXPos(i + 1), orbitImgs().calcYPos(i + 1)],
                    1
                )
            )
        )
    );
    yield* waitUntil("task4");

    yield* all(
        headline().text(todos.task5, 1),
        ...orbitImgs().rects.map((rect) => rect.opacity(0, 1))
    );
    yield orbitImgs().remove();

    const knotPositions: PossibleVector2[] = [
        [-300, 0],
        [0, 0],
        [300, 0],
    ];
    const knots: Knot[] = [];
    const spline = createRef<Spline>();

    yield view.add(
        <Spline ref={spline} lineWidth={6} stroke={Colors.MAIN} end={0}>
            {knotPositions.map((pos, i) => (
                <Knot ref={makeRef(knots, i)} position={pos} />
            ))}
        </Spline>
    );

    yield* spline().end(1, 1);
    yield* knots[1].position.y(100, 0.5).to(-100, 0.5).to(0, 0.5);
    yield* all(headline().text("", 1), spline().end(0, 1));

    yield* waitUntil("task5");
});

function* replaceRectWithImage(rect: Reference<Rect>, img: Reference<Img>) {
    yield* all(img().opacity(1, 1), rect().opacity(0, 1));
    yield rect().remove();
}
