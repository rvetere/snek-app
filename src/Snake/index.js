import React, { Component } from "react";
import Canvas from "./Canvas";

export const GRID_SIZE = 20;
export const CELL_SIZE = 30;

const move = (value, running, type) => {
  if (type === "x") {
    if (running === "left") {
      return value - 1;
    } else if (running === "right") {
      return value + 1;
    }
  } else if (type === "y") {
    if (running === "up") {
      return value - 1;
    } else if (running === "down") {
      return value + 1;
    }
  }

  return value;
};

export default class Snake extends Component {
  state = {
    running: "up",
    strokes: [
      {
        pos: {
          // only the first stroke has a pos..
          x: 10,
          y: 7
        },
        direction: "vertical",
        cells: [1, 1, 1]
      }
    ],
    gameOver: false
  };
  canvasRef = React.createRef();
  timer = null;

  componentDidMount() {
    this.draw();

    document.addEventListener("keydown", this.handleKeyPress);
    this.update();
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  componentDidUpdate() {
    this.draw();
  }

  update = () => {
    const { running, strokes } = this.state;

    const newStrokes = [];
    strokes.forEach((stroke, idx) => {
      const isLast = idx === strokes.length - 1;
      if (idx > 0) {
        if (isLast) {
          stroke.cells.pop();
          newStrokes[0].cells.push(1);
          if (!stroke.cells.length) {
            return;
          }
        }
        newStrokes.push({
          ...stroke
        });
        return;
      }

      // on the first stroke, just move pos
      let newX = move(stroke.pos.x, running, "x");
      let newY = move(stroke.pos.y, running, "y");

      const outOfBoundsTop = newY < 0;
      if (outOfBoundsTop) {
        newY = GRID_SIZE - 1;
      }

      newStrokes.push({
        ...stroke,
        pos: {
          x: newX,
          y: newY
        }
      });
    });

    this.setState({
      strokes: newStrokes
    });

    this.timer = setTimeout(this.update, 1000);
  };

  handleKeyPress = e => {
    const { running, strokes } = this.state;
    switch (e.key) {
      case "ArrowLeft":
        if (running !== "left" && running !== "right") {
          const newStrokes = [...strokes];
          const firstStroke = strokes[0];
          newStrokes.push({
            direction: "vertical",
            cells: new Array(firstStroke.cells.length - 1).fill(1)
          });
          firstStroke.cells = [1];
          firstStroke.pos.x -= 1;
          firstStroke.direction = "horizontal";
          this.setState({
            strokes: newStrokes,
            running: "left"
          });
          clearTimeout(this.timer);
          this.timer = setTimeout(this.update, 1000);
        }
        break;

      case "ArrowDown":
        if (running !== "down" && running !== "up") {
          const newStrokes = [...strokes];
          const firstStroke = strokes[0];
          newStrokes.push({
            direction: "horizontal",
            cells: new Array(firstStroke.cells.length - 1).fill(1)
          });
          firstStroke.cells = [1];
          firstStroke.pos.y += 2;
          firstStroke.direction = "vertical";
          this.setState({
            strokes: newStrokes,
            running: "down"
          });
          clearTimeout(this.timer);
          this.timer = setTimeout(this.update, 1000);
        }
        break;
    }
  };

  draw = () => {
    const { running, strokes } = this.state;
    const { current } = this.canvasRef;
    const ctx = current.getContext("2d");

    ctx.clearRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);

    const firstStroke = strokes[0];
    let x = firstStroke.pos.x;
    let y =
      running === "down"
        ? firstStroke.pos.y - firstStroke.cells.length
        : firstStroke.pos.y;
    let lastRect = null;
    strokes.forEach((stroke, idx) => {
      let width = stroke.direction === "vertical" ? 1 : stroke.cells.length;
      let height = stroke.direction === "vertical" ? stroke.cells.length : 1;

      const rect = {
        top: y,
        left: x,
        bottom: y + height,
        right: x + width
      };

      if (idx > 0) {
        // draw every further stroke except the first relative to the last rect..
        if (running === "left") {
          x = lastRect.right;
        } else if (running === "down") {
          y = lastRect.top - 1;
        }
      }

      ctx.fillRect(
        x * CELL_SIZE,
        y * CELL_SIZE,
        width * CELL_SIZE,
        height * CELL_SIZE
      );

      // overlap handling
      const gridHeight = GRID_SIZE;
      const outOfBoundsTop = y + height > gridHeight;
      if (outOfBoundsTop && running === "up") {
        const overlappingRest = y + height - gridHeight;

        ctx.fillRect(
          x * CELL_SIZE,
          0,
          width * CELL_SIZE,
          overlappingRest * CELL_SIZE
        );
      }

      lastRect = rect;
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
