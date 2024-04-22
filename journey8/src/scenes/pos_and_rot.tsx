import { Layout, Rect, makeScene2D } from "@motion-canvas/2d";
import { ImageCard, OrbitImages } from "../components/orbit-images";
import {
    DEFAULT,
    Direction,
    all,
    createRef,
    createSignal,
    linear,
    sequence,
    slideTransition,
    waitFor,
    waitUntil,
} from "@motion-canvas/core";
import { Colors } from "../../styles";
import {
    CodeBlock,
    insert,
    remove,
} from "@motion-canvas/2d/lib/components/CodeBlock";

const pexel = (id: number): string =>
    `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;

const imageIds = [911738, 416430, 310452, 327482, 325185];

export default makeScene2D(function* (view) {
    const orbitImgs = createRef<OrbitImages>();
    const previewSize = view.size().sub(160);
    const codeRef = createRef<CodeBlock>();

    view.add(<OrbitImages x={650} ref={orbitImgs} displayImages={false} />);

    yield* slideTransition(Direction.Right);

    yield* orbitImgs().scaleImages(3, 0.3);

    yield* waitFor(2);

    // yield* orbitImgs().rotation(10, 0.3).to(-10, 0.6).to(0, 0.3);
    const singleImg = orbitImgs().childrenAs<ImageCard>()[0];

    yield* singleImg.rotation(5, 0.3).to(-10, 0.6).to(0, 0.3);

    yield* waitUntil("yo");

    yield* all(
        orbitImgs().position.x(-125, 1),
        orbitImgs().imageCount(7, 0.3)
        // orbitImgs().sequenceScaleImages(1, 1)
    );
    // yield* all(...orbitImgs().rects.map((rect, i) => rect.opacity(1, 1.2)));

    yield* orbitImgs().sequenceScaleImages(1, 1);

    yield* waitUntil("imageUrls");

    view.add(
        <CodeBlock
            opacity={1}
            ref={codeRef}
            y={800}
            language="tsx"
            fontSize={32}
            code={`
categories: [
    { image: pexel(911738), title: "black mist" },
    { image: pexel(416430), title: "weddings" },
    { image: pexel(310452), title: "events" },
    { image: pexel(911738), title: "travel" },
    { image: pexel(327482), title: "street" },
    { image: pexel(327482), title: "concerts" },
    { image: pexel(310452), title: "animals" },
    { image: pexel(327482), title: "nature" },
],
`}
        />
    );

    yield* all(codeRef().y(0, 1), orbitImgs().position.y(-600, 1));

    yield* waitUntil("whereBeginNow");

    yield* all(codeRef().y(800, 1), orbitImgs().position.y(0, 1));
    yield* waitFor(1);
    yield* orbitImgs().imageCount(0, 0.3);
    // yield* waitFor(1);
    // yield* all(orbitImgs().position([1050, 0], 1), orbitImgs().scale(3, 1));

    yield* all(
        orbitImgs().position.x(0, 1),
        codeRef().edit(0.1)`export const OrbitImages = () => {...};`,
        codeRef().selection(DEFAULT, 1)
    );
    yield* all(codeRef().y(0, 1));
    yield* waitFor(2);
    yield* codeRef().edit(
        1
    )`export const OrbitImages = (${insert("{ radius, images }")}) => {...};`;

    yield* waitFor(3);

    yield* codeRef().edit(
        1,
        false
    )`${remove("export const OrbitImages = ({ radius, ")}images${remove(" }) => {...};")}`;
    yield* codeRef().selection(DEFAULT, 1);

    yield* codeRef().edit(1, false)`${insert("const ")}images${insert(` = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
    'https://example.com/image4.jpg',
    'https://example.com/image5.jpg'
];`)}`;

    yield* orbitImgs().position.y(-600, 1);
    yield* orbitImgs().imageCount(5, 0.3);
    yield* all(orbitImgs().position.y(-200, 1), codeRef().y(200, 1));
    yield* orbitImgs().scaleImages(3, 1);
    yield* all(
        ...orbitImgs().rects.map((rect, i) =>
            rect.src(pexel(imageIds[i % orbitImgs().rects.length]), 1)
        )
    );
    yield* waitFor(10);
});
