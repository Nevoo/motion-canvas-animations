import { Img, Layout, Txt, makeScene2D } from "@motion-canvas/2d";
import {
    CodeBlock,
    edit,
    insert,
    lines,
    remove,
} from "@motion-canvas/2d/lib/components/CodeBlock";
import {
    DEFAULT,
    Direction,
    all,
    createRef,
    linear,
    slideTransition,
    waitFor,
    waitUntil,
} from "@motion-canvas/core";

import * as THREE from "three";

import useTextureDocImage from "../images/useTextureDoc.png";
import { Three } from "../components/Three";
import { Colors, WhiteLabel } from "../../styles";

const loader = new THREE.TextureLoader();
const texturePromise = loader.loadAsync(useTextureDocImage);

const camera = new THREE.PerspectiveCamera();
camera.position.setZ(10);

const basicMaterial = new THREE.MeshBasicMaterial({
    color: 0x777777,
    side: THREE.DoubleSide,
});

export default makeScene2D(function* (view) {
    const codeRef = createRef<CodeBlock>();
    const previewSize = view.size().sub(160);

    const texture = yield texturePromise;
    basicMaterial.map = texture;

    const textureLine =
        'const colorMap = useLoader(TextureLoader, "path/to/texture.jpg");';

    yield* waitUntil("intro done");

    yield view.add(
        <Layout>
            <CodeBlock
                opacity={0}
                ref={codeRef}
                width={1700}
                x={1700 / 2 - 250}
                // position={[-400, 0]}
                fontSize={26}
                language="tsx"
                code={`
const colorMap = useLoader();
            `}
            />
        </Layout>
    );

    yield* codeRef().opacity(1, 1);
    yield* waitFor(5);
    yield* all(
        codeRef().position.x(325, 0.3),
        codeRef().edit(1.2)`
    ${insert(
        `import { TextureLoader } from 'three/src/loaders/TextureLoader';\n\n`
    )}const colorMap = useLoader(${insert(
            'TextureLoader, "path/to/texture.jpg"'
        )});
    `
    );

    yield* waitFor(0.5);

    yield* codeRef().opacity(0, 1);
    // codeRef().remove();
    const imageRef = createRef<Img>();

    view.add(
        <Img
            ref={imageRef}
            src={useTextureDocImage}
            size={previewSize}
            scale={0}
        />
    );

    yield* imageRef().scale(1, 1);
    yield* waitFor(2);
    yield* all(imageRef().position.y(700, 1), imageRef().scale(3, 1));
    yield* imageRef().position.y(0, 10, linear);
    yield* waitFor(2);
    yield* imageRef().scale(0, 1);
    yield imageRef().remove();

    yield* all(
        codeRef().position.y(-1000, 0),
        codeRef().edit(0)`
    import { extend } from '@react-three/fiber'
    import { Image } from '@react-three/drei'
    import { easing, geometry } from 'maath'

    extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

    function ImageCard() {
        return (
            <Image>
                <roundedPlaneGeometry args={[1, 2, 0.15]} />
            </Image>
        );
    }
`
    );
    yield* all(codeRef().selection(DEFAULT, 1), codeRef().opacity(1, 1));
    yield* codeRef().position.y(0, 1);

    yield* waitFor(2);

    yield* codeRef().edit(1)`
    import { extend } from '@react-three/fiber'
    import { Image } from '@react-three/drei'
    import { easing, geometry } from 'maath'

    extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

    function ImageCard() {
        return (
            <Image${insert(' url="/file.jpg"')}>
                <roundedPlaneGeometry args={[1, 2, 0.15]} />
            </Image>
        );
    }
`;

    yield* waitUntil("extendFunction");
    yield* codeRef().selection(lines(4), 1);

    yield* waitUntil("thisCase");
    yield* codeRef().selection([...lines(4), ...lines(9)], 1);

    yield* waitFor(3);
});
