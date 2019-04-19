import styled from "@emotion/styled";
import { Color, WidthProperty } from "csstype";
import hexToRgba from "hex-to-rgba";
import desaturate from "polished/lib/color/desaturate";
import * as React from "react";
import { Theme } from "../../schema/Theme";
import connect from "../components/connect";
import Contacts from "../components/Contacts";
import Presentation from "../components/Presentation";
import Sponsor from "../components/Sponsor";
import Sponsors from "../components/Sponsors";
import sponsorQuery from "../queries/sponsorQuery";

interface SchedulePageContainerProps {
  id: string;
  primaryColor: Color;
  secondaryColor: Color;
  texture: string;
  sideBarWidth: WidthProperty<string>;
}

const IntroTemplateContainer = styled.article`
  background-image: ${({
    primaryColor,
    secondaryColor,
    texture,
  }: SchedulePageContainerProps) => `linear-gradient(
      ${primaryColor},
      ${desaturate(0.2, hexToRgba(secondaryColor, 0.79))}
    ),
    url("${texture}")`};
  background-size: cover;
  position: relative;
  padding: 0;
  width: ${({ sideBarWidth }) =>
    sideBarWidth ? `calc(100vw - ${sideBarWidth})` : "100vw"};
  overflow: hidden;
` as React.FC<SchedulePageContainerProps>;

interface IntroTemplateProps {
  theme: Theme;
  conferenceId: string;
  id: string;
  sideBarWidth: WidthProperty<string>;
}

function IntroTemplate({ theme, id, sideBarWidth }: IntroTemplateProps) {
  return (
    <IntroTemplateContainer
      id={id}
      primaryColor={theme.colors.primary}
      secondaryColor={theme.colors.secondary}
      texture={theme.textures[0].url}
      sideBarWidth={sideBarWidth}
    >
      <Presentation
        presentationID="intro-presentation"
        slides={getSlides(theme)}
        theme={theme}
        features={{
          showSlideNumber: false,
          showSlideProgress: false,
        }}
      />
    </IntroTemplateContainer>
  );
}

const sponsorRules = {
  gold: {
    "max-height": "6cm",
    "max-width": "8cm",
    margin: "0 0.5cm 0.5cm 0.5cm",
    display: "block",
  },
  silver: {
    "max-height": "3cm",
    "max-width": "5cm",
    margin: "0.5cm",
  },
  bronze: {
    "max-height": "1.5cm",
    "max-width": "3.5cm",
    margin: "0.25cm 0.5cm 0cm 0.5cm",
  },
  partner: {
    "max-height": "3cm",
    "max-width": "5cm",
    margin: "1cm",
  },
};

const SponsorsContainer = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  background-color: #ffffffba;
`;

const ConnectedSponsors = connect(
  "/graphql",
  sponsorQuery,
  ({ conferenceId }) => ({ conferenceId })
)(({ conference }) => <Sponsors {...conference} rules={sponsorRules} />);

const PartnersContainer = styled.div`
  grid-template-columns: 1fr 1fr 1fr 1fr;
  height: 100%;
  width: 100%;
  display: grid;
  background-color: #ffffffba;
`;

const ConnectedPartners = connect(
  "/graphql",
  sponsorQuery,
  ({ conferenceId }) => ({ conferenceId })
)(({ conference }) => (
  <Contacts
    items={conference && conference.partners}
    render={Sponsor}
    renderProps={{ rules: sponsorRules, type: "partner" }}
  />
));

function getSlides(theme) {
  const titleSlide = [
    {
      layout: "IMAGE",
      content: {
        url: theme.logos.white.withText.url,
      },
    },
    {
      layout: "IMAGE",
      content: {
        url: "/media/assets/pineapple.jpg",
      },
    },
    {
      layout: "IMAGE",
      content: {
        url: "https://imgoat.com/uploads/8baa56554f/141386.jpeg",
      },
    },
    {
      layout: "TITLE",
      content: {
        title: "6 workshops",
      },
    },
    {
      layout: "TITLE",
      content: {
        title: "~400 people",
      },
    },
    {
      layout: "TITLE",
      content: {
        title: "27 speakers",
      },
    },
    {
      layout: "TITLE",
      content: {
        title: "Two days",
      },
    },
    {
      layout: "TITLE",
      content: {
        title: "Single track",
      },
    },
    {
      layout: "TITLE",
      content: {
        title: "Themed sessions",
      },
    },
    {
      layout: "TITLE",
      content: {
        title: "Professional MCs",
      },
    },
    {
      layout: "IMAGE",
      content: {
        url: "/media/assets/disco.jpg",
      },
    },
    {
      layout: "REACT",
      content: (
        <SponsorsContainer>
          <ConnectedSponsors conferenceId="react-finland-2019" />
        </SponsorsContainer>
      ),
    },
    {
      layout: "REACT",
      content: (
        <PartnersContainer>
          <ConnectedPartners conferenceId="react-finland-2019" />
        </PartnersContainer>
      ),
    },
  ];

  return titleSlide;
}

export default IntroTemplate;