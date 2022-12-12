/*
 * @description:
 * @author: pengrenchang
 * @Date: 2022-11-07 11:43:41
 * @LastEditors: pengrenchang
 * @LastEditTime: 2022-11-17 17:15:14
 */
import { useLocalStorageState } from "ahooks";
import { toNumber } from "lodash";
import { useEffect, useState } from "react";
import "./App.css";

interface lvType {
    name: string;
    age: number;
}

interface txeType extends lvType {
    arr: number[];
}

function App() {
    const [age, setAge] = useState<number>(0);
    const [nA, setNA] = useState<number[]>([]);
    const [message, setMessage] = useLocalStorageState<number | undefined>(
        "use-local-storage-state-demo1",
        {
            defaultValue: 1,
        }
    );

    const handleStart = () => {
        setMessage((v: any) => toNumber(v) + 1);
        setNA(() => {
            return [...nA, 2];
        });
        // setAge((c) => {
        //     console.log(c);
        //     return c + 1;
        // });
        // let o1 = { name: "o1" };
        // let o2 = new Object({ name: "o2" });
        // let M = () => {
        // };
        // M.prototype.name = 'o3',
        // const f1 = new Foo();
        // con  t f2 = new Foo();
        // const f5 = new Foo();
        // // const object = {};
        // // Foo.prototype.name = "我是一个属性name";
        // // // Foo.prototype.constructor
        // // console.log(Foo.prototype);
        // // console.log(Foo.prototype.constructor);
        // f2.__proto__.say = () => {
        //     console.log("我是__proto__添加的say");
        // };
        // f1.say();
        // f5.say();
        // console.log(f2.say());
        // console.log(Foo.prototype.__proto__);
        // console.log(object.prototype);
        // console.log(f1.prototype.constructor);
        // console.log(f2.name);
        // console.log(f1.__proto__);
    };
    console.log(age);

    useEffect(() => {
        console.log(nA);
        console.log("数组变化");
    }, [nA]);

    return (
        <div>
            <div>{age}</div>
            <div>{nA}</div>
            <div>{message}</div>
            <button onClick={handleStart}>发起</button>
        </div>
    );
}

export default App;
