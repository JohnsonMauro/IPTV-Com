
export class MovableHelper {

  public static executeDefaultKeyUpForTextWrapper(event: KeyboardEvent) {
    let target = <HTMLElement>(event.target || event.currentTarget);
    switch (event.keyCode) {
      //Enter
      case 13:
        let first = <HTMLElement>target.children[0];
        first.focus();
        break;
      default:
        break;
    }
  }

  public static executeDefaultKeyDownForInputText(event: KeyboardEvent) {
    let target = <HTMLElement>(event.target || event.currentTarget);
    //Arrow keys     
    switch (event.keyCode) {
      //left up right down
      case 37:
      case 38:
      case 39:
      case 40:
        target.parentElement.focus();
        break;
      default:
        break;
    }
  }


  public static executeDefaultKeyUpForInputText(event: KeyboardEvent) {
    let target = <HTMLElement>(event.target || event.currentTarget);
    switch (event.keyCode) {
      //Enter
      case 13:
        target.parentElement.focus();
        break;
      default:
        break;
    }
  }
}

