import React, { PureComponent } from "react";
import { GRID_SIZE, CELL_SIZE } from "./index";

export default class Canvas extends PureComponent {
  canvasRef = React.createRef();

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  draw = () => {
    console.log("paint");
    const { cells } = this.props;
    const { current } = this.canvasRef;
    const ctx = current.getContext("2d");

    ctx.clearRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);

    const lines = new Array(GRID_SIZE).fill(new Array(GRID_SIZE).fill(0));

    lines.forEach((line, y) => {
      line.forEach((pixel, x) => {
        const cell = cells && cells[y] && cells[y][x] ? cells[y][x] : null;
        if (cell && cell === 1) {
          ctx.fillRect(
            x * CELL_SIZE, // x
            y * CELL_SIZE, // y
            CELL_SIZE, // width
            CELL_SIZE // height
          );
        } else {
          // ctx.rect(
          //   x * CELL_SIZE, // x
          //   y * CELL_SIZE, // y
          //   CELL_SIZE, // width
          //   CELL_SIZE // height
          // );
          // ctx.stroke();
        }
      });
    });
  };

  render() {
    const styleObj = {
      width: GRID_SIZE * CELL_SIZE,
      height: GRID_SIZE * CELL_SIZE
    };
    return <canvas ref={this.canvasRef} {...styleObj} />;
  }
}
