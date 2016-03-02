export default function ({ types: t }) {
  const FLOW_DIRECTIVE = "@flow";

  return {
    inherits: require("babel-plugin-syntax-flow"),

    visitor: {
      Program(path, { file: { ast: { comments } } }) {
        for (let comment of comments) {
          if (comment.value.indexOf(FLOW_DIRECTIVE) >= 0) {
            // remove flow directive
            comment.value = comment.value.replace(FLOW_DIRECTIVE, "");

            // remove the comment completely if it only consists of whitespace and/or stars
            if (!comment.value.replace(/\*/g, "").trim()) comment.ignore = true;
          }
        }
      },

      Flow(path) {
        path.remove();
      },

      ClassProperty(path) {
        path.node.typeAnnotation = null;
        if (!path.node.value) path.remove();
      },

      Class({ node }) {
        node.implements = null;
      },

      Function({ node }) {
        for (let i = 0; i < node.params.length; i++) {
          let param = node.params[i];
          param.optional = false;
        }
      },

      TypeCastExpression(path) {
        let { node } = path;
        do {
          node = node.expression;
        } while (t.isTypeCastExpression(node));
        path.replaceWith(node);
      }
    }
  };
}
