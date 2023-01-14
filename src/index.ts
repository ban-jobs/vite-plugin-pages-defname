import { parse, MagicString, compileScript, SFCScriptBlock } from "@vue/compiler-sfc";
import type { Plugin } from "vite";

declare global {
  const defname: (name: string) => void;
}

const DEFINE_NAME = "defname";
function YAMLParser(str) {
  const defname = (str.match(/\r?\ndefname:\s?(.*)?(\s)/m)?.[1] || "").split(/\s|#/)[0];
  const name = (str.match(/\r?\nname:\s?(.*)?(\s)/m)?.[1] || "").split(/\s|#/)[0];
  return { defname, name };
}

function getRouteOptions(code: string) {
  const yamlstr = code.match(/<route lang="yaml">((.|\r?\n)*)<\/route>/m)?.[0] || "";

  if (yamlstr) {
    const yamlResult = YAMLParser(yamlstr);
    return yamlResult;
  }
  return null;
}

function getDefCallExpression(scriptSetup: SFCScriptBlock) {
  const callExpressionList = scriptSetup.scriptSetupAst!.filter(
    (node) =>
      node.type === "ExpressionStatement" &&
      node.expression.type === "CallExpression" &&
      node.expression.callee.type === "Identifier" &&
      node.expression.callee.name === DEFINE_NAME
  );
  return callExpressionList[callExpressionList.length - 1];
}

function getScriptOptions(callExpression: any) {
  if (!callExpression) return null;
  return callExpression.expression.arguments[0].value;
}

function defnamePlugin(): Plugin {
  return {
    name: "vite-plugin-pages-defname",
    enforce: "pre",
    transform(code, id) {
      const isScript = code.includes(DEFINE_NAME + "(");
      const isYaml = !isScript && code.includes('<route lang="yaml">');
      
      if (!isYaml && !isScript) return;
      const { descriptor } = parse(code, { filename: id });

      if (!descriptor.scriptSetup) return;

      const { source, scriptSetup } = descriptor;

      let s: MagicString | undefined;
      const str = () => s || (s = new MagicString(source));

      let componentName = null;
      let callExpression: any;

      if (isScript) {
        if (!descriptor.scriptSetup.scriptSetupAst) {
          descriptor.scriptSetup = compileScript(descriptor, { id });
        }
        callExpression = getDefCallExpression(descriptor.scriptSetup);
        componentName = getScriptOptions(callExpression);
        if (componentName) {
          str().remove(scriptSetup.loc.start.offset + callExpression.start, scriptSetup.loc.start.offset + callExpression.end);
        }
      }

      if (!componentName) {
        const routeOptions = getRouteOptions(code);
        componentName = routeOptions && (routeOptions.defname || routeOptions.name);
      }
      if (!componentName) return;

      str().appendLeft(
        0,
        `
<script lang="${scriptSetup.attrs.lang || "js"}">
  export default {
    name: '${componentName}'
  }
</script>
`
      );

      const result = {
        code: str().toString(),
        map: str().generateMap({
          source: id,
          includeContent: true,
        }),
      };

      return { ...result };
    },
  };
}

export default defnamePlugin;
