/**
 * mihomo配置覆写脚本（基于 1.yaml 转换）
 * 转换自: 1.yaml
 * 格式参考: https://github.com/AIsouler/MyClash
 */

// --- 静态配置区域 ---

const ruleOptionsEnable = {
  telegram: true,
  apple: true,
  allproxy: true,
  linuxdo: true,
};

const excludeFilter =
  /群|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入|超时|收藏|福利|邀请|好友|失联|选择|剩余|公益|发布|登录|禁止|定时|渠道|牢记|永久|余额|阁下|本站|刷新|导航|⚠️|@|Expire|http|com/u;

const rules = [
  'GEOSITE,private,DIRECT',
  'GEOIP,private,DIRECT,no-resolve',
];

const regionDefinitions = [
  {
    name: '香港',
    regex: /🇭🇰|港|HK|[Hh]ong\s*[Kk]ong/,
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hong_Kong.png',
  },
  {
    name: '日本',
    regex: /🇯🇵|日本|JP|[Jj]apan/,
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Japan.png',
  },
  {
    name: '美国',
    regex: /🇺🇸|美|US|[Aa]merica|[Uu]nited\s*[Ss]tates/,
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_States.png',
  },
  {
    name: '新加坡',
    regex: /🇸🇬|新加坡|狮城|SG|[Ss]ingapore/,
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Singapore.png',
  },
  {
    name: '台湾省',
    regex: /🇹🇼|台湾|TW|[Tt]aiwan/,
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Taiwan.png',
  },
];

const regionDefinitionsEnable = {
  香港: true,
  日本: true,
  美国: true,
  新加坡: true,
  台湾省: true,
};

const excludeFilterEnable = true;

const groupBaseOption = {
  interval: 600,
  timeout: 3000,
  url: 'https://g.cn/generate_204',
  lazy: true,
  'max-failed-times': 3,
};

const selectBaseOption = {
  ...groupBaseOption,
  type: 'select',
  hidden: false,
};

const urlTestBaseOption = {
  ...groupBaseOption,
  type: 'url-test',
  tolerance: 100,
  'exclude-type': 'DIRECT',
  icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Auto.png',
  hidden: true,
};

const loadBalanceBaseOption = {
  ...groupBaseOption,
  type: 'load-balance',
  strategy: 'sticky-sessions',
  'exclude-type': 'DIRECT',
  icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Round_Robin.png',
  hidden: true,
};

const ruleProviderFormatMrs = { format: 'mrs' };
const ruleProviderCommonDomain = {
  type: 'http',
  interval: 86400,
  behavior: 'domain',
};
const ruleProviderCommonClassical = {
  type: 'http',
  interval: 86400,
  behavior: 'classical',
};

// 基础 rule-providers (用于 DNS fake-ip-filter 和基础分流)
const baseRuleProviders = {
  private: {
    ...ruleProviderCommonDomain,
    ...ruleProviderFormatMrs,
    url: 'https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/private.mrs',
    path: './ruleset/private.mrs',
    'path-in-bundle': 'geo/geosite/private.mrs',
  },
  private_ip: {
    type: 'http',
    interval: 86400,
    behavior: 'ipcidr',
    ...ruleProviderFormatMrs,
    url: 'https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geoip/private.mrs',
    path: './ruleset/private_ip.mrs',
    'path-in-bundle': 'geo/geoip/private.mrs',
  },
  fakeip_filter: {
    ...ruleProviderCommonDomain,
    ...ruleProviderFormatMrs,
    url: 'https://fastly.jsdelivr.net/gh/wwqgtxx/clash-rules@release/fakeip-filter.mrs',
    path: './ruleset/fakeip-filter.mrs',
    'path-in-bundle': 'geo/geosite/fakeip-filter.mrs',
  },
  cn: {
    ...ruleProviderCommonDomain,
    ...ruleProviderFormatMrs,
    url: 'https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/cn.mrs',
    path: './ruleset/cn.mrs',
    'path-in-bundle': 'geo/geosite/cn.mrs',
  },
  cn_ip: {
    type: 'http',
    interval: 86400,
    behavior: 'ipcidr',
    ...ruleProviderFormatMrs,
    url: 'https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geoip/cn.mrs',
    path: './ruleset/cn_ip.mrs',
    'path-in-bundle': 'geo/geoip/cn.mrs',
  },
};

// 构建地区策略组
function createRegionGroup(name, icon, proxies) {
  const autoTestName = `${name}-自动选择`;
  const loadBalanceName = `${name}-负载均衡`;
  return [
    {
      ...urlTestBaseOption,
      name: autoTestName,
      proxies,
    },
    {
      ...loadBalanceBaseOption,
      name: loadBalanceName,
      proxies,
    },
    {
      ...selectBaseOption,
      name,
      icon,
      proxies: [...proxies, autoTestName, loadBalanceName],
    },
  ];
}

// --- 主入口 ---

function main(config) {
  const newConfig = {};

  // 排除匹配到的节点
  if (excludeFilterEnable && Array.isArray(config.proxies)) {
    config.proxies = config.proxies.filter(
      (proxy) => !excludeFilter.test(proxy.name)
    );
  }

  const proxies = config.proxies || [];

  const allDirectOrReject = proxies.every((p) => {
    const type = p.type?.toLowerCase();
    return type === 'direct' || type === 'reject';
  });

  if (!proxies.length || allDirectOrReject) {
    throw new Error(
      '配置文件中未找到任何代理节点，请使用机场提供的配置文件进行覆写'
    );
  }

  // --- DNS 配置（完整保留 1.yaml 的 DNS 设置） ---
  newConfig['dns'] = {
    enable: true,
    ipv6: false,
    'enhanced-mode': 'fake-ip',
    'fake-ip-range': '198.18.0.0/16',
    'fake-ip-filter': [
      '*.lan',
      '*.local',
      '*.arpa',
      'time.*.com',
      'ntp.*.com',
      '+.market.xiaomi.com',
      'localhost.ptlogin2.qq.com',
      '*.msftncsi.com',
      'www.msftconnecttest.com',
    ],
    'default-nameserver': [
      '119.29.29.29',
      '223.5.5.5',
    ],
    'nameserver-policy': {
      'geosite:cn,private,apple': [
        'https://doh.pub/dns-query',
        'https://dns.alidns.com/dns-query',
      ],
      '*.linux.do': 'https://xxx.ddd.oaifree.com/query-dns',
      'linux.do': 'https://xxx.ddd.oaifree.com/query-dns',
    },
    nameserver: [
      'https://1.1.1.1/dns-query#RULES',
      'https://8.8.8.8/dns-query#RULES',
    ],
    'proxy-server-nameserver': [
      '119.29.29.29',
      '223.5.5.5',
    ],
    'direct-nameserver': [
      'https://doh.pub/dns-query',
      'https://dns.alidns.com/dns-query',
    ],
    'direct-nameserver-follow-policy': true,
  };

  // --- 节点分类 ---
  const enabledDefinitions = regionDefinitions.filter(
    (r) => regionDefinitionsEnable[r.name] === true
  );
  const regionGroups = Object.fromEntries(
    enabledDefinitions.map((r) => [r.name, { ...r, proxies: [] }])
  );
  const otherProxies = [];

  for (const proxy of proxies) {
    let matched = false;
    for (const region of enabledDefinitions) {
      if (region.regex.test(proxy.name)) {
        regionGroups[region.name].proxies.push(proxy.name);
        matched = true;
      }
    }
    if (!matched) {
      otherProxies.push(proxy.name);
    }
  }

  // --- 构建策略组 ---
  const generatedRegionGroups = enabledDefinitions
    .filter((r) => regionGroups[r.name].proxies.length > 0)
    .flatMap((r) =>
      createRegionGroup(r.name, r.icon, regionGroups[r.name].proxies)
    );

  if (otherProxies.length > 0) {
    generatedRegionGroups.push(
      ...createRegionGroup(
        '其他节点',
        'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/World_Map.png',
        otherProxies
      )
    );
  }

  const groupNamesOfSelect = generatedRegionGroups
    .filter((g) => g.type === 'select')
    .map((g) => g.name);

  const functionalGroups = [];

  functionalGroups.push(
    {
      ...selectBaseOption,
      name: '🚀 节点选择',
      proxies: [...groupNamesOfSelect, '自动选择', '负载均衡'],
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Proxy.png',
    },
    {
      ...urlTestBaseOption,
      name: '自动选择',
      'include-all': true,
    },
    {
      ...loadBalanceBaseOption,
      name: '负载均衡',
      'include-all': true,
    },
  );

  const finalRules = [...rules];
  const finalRuleProviders = { ...baseRuleProviders };

  // rule-providers 配置（与 1.yaml 一致）
  const rpTelegram = {
    type: 'http',
    behavior: 'classical',
    url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Telegram/Telegram_No_Resolve.yaml',
    format: 'yaml',
    path: './ruleset/Telegram.yaml',
    interval: 86400,
  };

  const rpApple = {
    type: 'http',
    behavior: 'classical',
    url: 'https://cdn.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/Providers/Apple.yaml',
    format: 'yaml',
    path: './ruleset/Apple.yaml',
    interval: 86400,
  };

  const rpAllProxy = {
    type: 'http',
    behavior: 'domain',
    url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Global/Global_Domain.yaml',
    format: 'yaml',
    path: './ruleset/AllProxy.yaml',
    interval: 86400,
  };

  if (ruleOptionsEnable.telegram) {
    finalRuleProviders['Telegram'] = rpTelegram;
    finalRules.push('RULE-SET,Telegram,📲 电报消息');
    functionalGroups.push({
      ...selectBaseOption,
      name: '📲 电报消息',
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Telegram.png',
      proxies: ['🚀 节点选择', '自动选择', '负载均衡', ...groupNamesOfSelect],
    });
  }

  if (ruleOptionsEnable.apple) {
    finalRuleProviders['Apple'] = rpApple;
    finalRules.push('RULE-SET,Apple,🎯 全球直连');
  }

  if (ruleOptionsEnable.linuxdo) {
    finalRules.push('DOMAIN-SUFFIX,linux.do,🐧 Linux.do');
    functionalGroups.push({
      ...selectBaseOption,
      name: '🐧 Linux.do',
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Linux.png',
      proxies: ['🚀 节点选择', '自动选择', '负载均衡', ...groupNamesOfSelect],
    });
  }

  if (ruleOptionsEnable.allproxy) {
    finalRuleProviders['AllProxy'] = rpAllProxy;
    finalRules.push('RULE-SET,AllProxy,🚀 节点选择');
  }

  // 国内直连分流
  finalRules.push('GEOSITE,CN,🎯 全球直连');
  finalRules.push('RULE-SET,AllProxy,🚀 节点选择');
  finalRules.push('GEOIP,CN,🎯 全球直连');
  finalRules.push('MATCH,🚀 节点选择');

  // 直连策略组
  functionalGroups.push({
    ...selectBaseOption,
    name: '🎯 全球直连',
    proxies: ['🇨🇳 直连 | IPv4优先', '🇨🇳 直连 | IPv6优先', '🇨🇳 直连 | 双栈'],
    url: 'https://connectivitycheck.platform.hicloud.com/generate_204',
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/China_Map.png',
  });

  // GLOBAL 组
  const globalGroup = {
    ...selectBaseOption,
    name: 'GLOBAL',
    proxies: [
      ...functionalGroups.map((g) => g.name),
      ...generatedRegionGroups.map((g) => g.name),
    ],
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png',
  };

  // 添加直连节点
  const directProxies = [
    {
      name: '🇨🇳 直连 | IPv4优先',
      type: 'direct',
      'ip-version': 'ipv4-prefer',
    },
    {
      name: '🇨🇳 直连 | IPv6优先',
      type: 'direct',
      'ip-version': 'ipv6-prefer',
    },
    {
      name: '🇨🇳 直连 | 双栈',
      type: 'direct',
    },
  ];

  newConfig.proxies = [...config.proxies, ...directProxies];
  newConfig['proxy-groups'] = [
    globalGroup,
    ...functionalGroups,
    ...generatedRegionGroups,
  ];
  newConfig['rule-providers'] = finalRuleProviders;
  newConfig['rules'] = finalRules;

  newConfig['allow-lan'] = true;
  newConfig['bind-address'] = '*';
  newConfig['unified-delay'] = true;
  newConfig['tcp-concurrent'] = true;
  newConfig['keep-alive-idle'] = 600;
  newConfig['keep-alive-interval'] = 60;
  newConfig['find-process-mode'] = 'strict';
  newConfig['external-controller'] = '[::]:9090';

  newConfig['tun'] = {
    enable: true,
    stack: 'system',
    mtu: 9000,
    'auto-route': true,
    'strict-route': true,
    'auto-redirect': true,
    'auto-detect-interface': true,
    'dns-hijack': ['any:53', 'tcp://any:53'],
  };

  return newConfig;
}
